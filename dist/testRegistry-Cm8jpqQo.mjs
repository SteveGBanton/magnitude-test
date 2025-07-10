import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { build } from 'esbuild';
import cuid2 from '@paralleldrive/cuid2';
import { pathToFileURL } from 'node:url';

class TestCompiler {
  cacheDir;
  defaultOptions = {
    format: "esm",
    platform: "node",
    target: "node18",
    sourcemap: true,
    bundle: true,
    external: [
      //"magnitude-ts",
      //"magnitude-test",
      "node:fs",
      "node:path",
      "node:os",
      "node:util",
      "node:events",
      "node:stream",
      "node:assert",
      "node:url",
      "node:crypto",
      "node:buffer",
      "node:querystring",
      "node:fsevents"
      //"@boundaryml/baml/*",
    ],
    alias: {
      "fs": "node:fs"
    },
    banner: {
      js: `
        import { fileURLToPath as __magCompileFileURLToPath } from 'node:url';
        import { dirname as __magCompileDirname } from 'node:path';
        import { createRequire as __magCompileCreateRequire } from 'node:module';

        const __filename = __magCompileFileURLToPath(import.meta.url);
        const __dirname = __magCompileDirname(__filename);
        const require = __magCompileCreateRequire(import.meta.url);
      `
    }
  };
  constructor() {
    this.cacheDir = join(tmpdir(), "magnitude-cache");
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }
  async compileFile(filePath) {
    const fileName = basename(filePath).replace(".ts", ".mjs");
    const outputPath = join(this.cacheDir, fileName);
    const packageJson = {
      type: "module"
      //   imports: {
      //     "magnitude-ts": "magnitude-ts"//resolve(process.cwd(), "src/index.ts"),//"packages/magnitude-ts/src/index.ts"),
      //   },
    };
    writeFileSync(
      join(this.cacheDir, "package.json"),
      JSON.stringify(packageJson)
    );
    await build({
      ...this.defaultOptions,
      entryPoints: [filePath],
      outfile: outputPath,
      //   alias: {
      //     "magnitude-ts": "magnitude-ts"//resolve(process.cwd(), "src/index.ts")//"packages/magnitude-ts/src/index.ts"),
      //   },
      resolveExtensions: [".ts", ".js", ".mjs"],
      banner: {
        js: `
          import { fileURLToPath as __magCompileFileURLToPath } from 'node:url';
          import { dirname as __magCompileDirname } from 'node:path';
          import { createRequire as __magCompileCreateRequire } from 'node:module';

          const __filename = __magCompileFileURLToPath(import.meta.url);
          const __dirname = __magCompileDirname(__filename);
          const require = __magCompileCreateRequire(import.meta.url);
        `
      }
    });
    return outputPath;
  }
}

const IPV4_IN_IPV6_PREFIX = "::f{4}:";
const LOOPBACK_IP_RANGES = [
  // 127.0.0.0 - 127.255.255.255 (IPv4 loopback)
  new RegExp(`^(${IPV4_IN_IPV6_PREFIX})?127\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}`),
  // ::1 (IPv6 loopback)
  /^::1$/
];
const SPECIAL_LOCAL_IPS = ["::1", "::", "0.0.0.0"];
const LOCALHOST_DOMAINS = ["localhost"];
function isLoopbackIp(address) {
  return SPECIAL_LOCAL_IPS.includes(address) || LOOPBACK_IP_RANGES.some((pattern) => pattern.test(address));
}
function extractHostname(urlOrHostname) {
  try {
    if (!urlOrHostname.includes("://")) {
      urlOrHostname = "http://" + urlOrHostname;
    }
    const parsedUrl = new URL(urlOrHostname);
    return parsedUrl.hostname.toLowerCase();
  } catch (error) {
    return urlOrHostname.toLowerCase();
  }
}
function cleanHostname(hostname) {
  return hostname.replace(/^\[|\]$/g, "");
}
function isLocalhostDomain(hostname) {
  const lowerHostname = hostname.toLowerCase();
  return LOCALHOST_DOMAINS.includes(lowerHostname) || lowerHostname.endsWith(".localhost");
}
function isLoopbackHost(urlOrHostname) {
  try {
    const hostname = extractHostname(urlOrHostname);
    if (isLocalhostDomain(hostname)) {
      return true;
    }
    return isLoopbackIp(cleanHostname(hostname));
  } catch (error) {
    console.error("Invalid URL or hostname:", error);
    return false;
  }
}
function isLoopbackUrl(url) {
  return isLoopbackHost(url);
}
function addProtocolIfMissing(url) {
  if (!url.includes("://")) {
    if (isLoopbackUrl(url)) {
      return `http://${url}`;
    } else {
      return `https://${url}`;
    }
  } else {
    return url;
  }
}
function describeModel(client) {
  if (client.model !== "unknown") {
    return `${client.provider}:${client.model}`;
  } else {
    return `${client.provider}`;
  }
}
const knownCostMap = {
  "gemini-2.5-pro": [1.25, 10],
  "gemini-2.5-flash": [0.15, 0.6],
  "claude-3.5-sonnet": [3, 15],
  "claude-3.7-sonnet": [3, 15],
  "gpt-4.1": [2, 8],
  "gpt-4.1-mini": [0.4, 1.6],
  "gpt-4.1-nano": [0.1, 0.4],
  "gpt-4o": [3.75, 15]
};
function processUrl(...urls) {
  if (urls.length === 0) return;
  if (urls.length === 1) return urls[0];
  const [base, relative, ...rest] = urls;
  if (!relative) return processUrl(base, ...rest);
  if (!base) return processUrl(relative, ...rest);
  try {
    return processUrl(new URL(relative).toString(), ...rest);
  } catch {
    try {
      return processUrl(new URL(relative, base).toString(), ...rest);
    } catch (_e) {
      return processUrl(relative, ...rest);
    }
  }
}

const generateId = cuid2.init({ length: 12 });
class TestRegistry {
  //private static instance: TestRegistry;
  // map from filepath to ungrouped & grouped test cases
  tests = [];
  //private tests: CategorizedTestCases = {};
  currentGroup;
  currentFilePath;
  globalOptions;
  compiler;
  constructor() {
    this.compiler = new TestCompiler();
  }
  static getInstance() {
    if (!globalThis.__magnitude__) {
      globalThis.__magnitude__ = {};
    }
    if (!globalThis.__magnitude__.registry) {
      globalThis.__magnitude__.registry = new TestRegistry();
    }
    return globalThis.__magnitude__.registry;
  }
  register(testCase) {
    if (!this.currentFilePath) {
      throw Error("File path context not set before registering test");
    }
    const id = generateId();
    const filepath = this.currentFilePath;
    this.tests.push({
      id,
      fn: testCase.fn,
      title: testCase.title,
      url: testCase.url,
      filepath,
      group: this.currentGroup?.name
    });
  }
  getRegisteredTests() {
    return this.tests;
  }
  // public getRegisteredTestCases(): CategorizedTestCases {
  //     return this.tests;
  // }
  // public getFlattenedTestCases(): Array<CategorizedTestRunnable> {
  //     const tests = [];
  //     for (const filePath in this.tests) {
  //         // Add ungrouped tests
  //         for (const runnable of this.tests[filePath].ungrouped) {
  //             tests.push({ ...runnable, file: filePath, group: null });
  //         }
  //         // Add grouped tests
  //         for (const groupName in this.tests[filePath].groups) {
  //             for (const runnable of this.tests[filePath].groups[groupName]) {
  //                 tests.push({ ...runnable, file: filePath, group: groupName });
  //             }
  //         }
  //     }
  //     return tests;
  // }
  setCurrentGroup(group) {
    this.currentGroup = group;
  }
  unsetCurrentGroup() {
    this.currentGroup = void 0;
  }
  setCurrentFilePath(filePath) {
    this.currentFilePath = filePath;
  }
  unsetCurrentFilePath() {
    this.currentFilePath = void 0;
  }
  setGlobalOptions(options) {
    this.globalOptions = options;
  }
  // Get current option overrides for the active group scope
  getActiveOptions() {
    const envOptions = process.env.MAGNITUDE_TEST_URL ? {
      url: process.env.MAGNITUDE_TEST_URL
    } : {};
    return {
      ...this.globalOptions,
      ...envOptions,
      // env options take precedence over global options
      ...this.currentGroup?.options ?? {},
      url: processUrl(envOptions.url, this.globalOptions.url, this.currentGroup?.options?.url)
    };
  }
  async loadTestFile(absoluteFilePath, relativeFilePath) {
    try {
      this.setCurrentFilePath(relativeFilePath);
      const compiledPath = await this.compiler.compileFile(absoluteFilePath);
      await import(pathToFileURL(compiledPath).href);
    } catch (error) {
      console.error(`Failed to load test file ${relativeFilePath}:`, error);
      throw error;
    } finally {
      this.unsetCurrentFilePath();
    }
  }
}

export { TestCompiler as T, TestRegistry as a, addProtocolIfMissing as b, describeModel as d, knownCostMap as k, processUrl as p };
