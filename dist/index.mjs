import { a as TestRegistry, p as processUrl, b as addProtocolIfMissing } from './testRegistry-Cm8jpqQo.mjs';
import 'node:fs';
import 'node:os';
import 'node:path';
import 'esbuild';
import '@paralleldrive/cuid2';
import 'node:url';

function testDecl(title, optionsOrTestFn, testFnOrNothing) {
  let options;
  let testFn;
  if (typeof optionsOrTestFn == "function") {
    options = {};
    testFn = optionsOrTestFn;
  } else {
    options = optionsOrTestFn;
    if (!testFnOrNothing) {
      throw new Error("Test function is required");
    }
    testFn = testFnOrNothing;
  }
  const registry = TestRegistry.getInstance();
  const registryOptions = registry.getActiveOptions();
  const combinedOptions = {
    ...registryOptions,
    ...options ?? {},
    url: processUrl(registryOptions.url, options?.url)
  };
  if (!combinedOptions.url) {
    throw Error("URL must be provided either through (1) env var MAGNITUDE_TEST_URL, (2) via magnitude.config.ts, or (3) in group or test options");
  }
  registry.register({
    fn: testFn,
    title,
    url: addProtocolIfMissing(combinedOptions.url)
  });
}
testDecl.group = function(id, optionsOrTestFn, testFnOrNothing) {
  let options;
  let testFn;
  if (typeof optionsOrTestFn == "function") {
    options = {};
    testFn = optionsOrTestFn;
  } else {
    options = optionsOrTestFn;
    if (!testFnOrNothing) {
      throw new Error("Test function is required");
    }
    testFn = testFnOrNothing;
  }
  const registry = TestRegistry.getInstance();
  registry.setCurrentGroup({
    name: id,
    options
  });
  testFn();
  registry.unsetCurrentGroup();
};
const test = testDecl;

process.env.NODE_ENV = process.env.NODE_ENV || "production";

export { test };
