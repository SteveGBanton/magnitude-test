import { TestCompiler } from "@/compiler";
import { processUrl } from "@/util";
import cuid2 from "@paralleldrive/cuid2";
import { pathToFileURL } from "node:url";
const generateId = cuid2.init({ length: 12 });
export class TestRegistry {
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
        // Use globalThis to ensure same instance is used across module boundaries
        if (!globalThis.__magnitude__) {
            globalThis.__magnitude__ = {};
        }
        if (!globalThis.__magnitude__.registry) {
            globalThis.__magnitude__.registry = new TestRegistry();
        }
        return globalThis.__magnitude__.registry;
    }
    register(testCase) {
        // Register a test case to be tracked by test runner
        if (!this.currentFilePath) {
            throw Error("File path context not set before registering test");
        }
        const id = generateId();
        const filepath = this.currentFilePath;
        this.tests.push({
            id: id,
            fn: testCase.fn,
            title: testCase.title,
            url: testCase.url,
            filepath: filepath,
            group: this.currentGroup?.name
        });
        // if (!(this.currentFilePath in this.tests)) {
        //     this.tests[this.currentFilePath] = { ungrouped: [], groups: {} }
        // }
        // const testsForPath = this.tests[this.currentFilePath];
        // if (this.currentGroup) {
        //     const groupName = this.currentGroup.name;
        //     if (!(groupName in testsForPath.groups)) {
        //         testsForPath.groups[groupName] = [];
        //     }
        //     testsForPath.groups[groupName].push(testCase);
        // } else {
        //     testsForPath.ungrouped.push(testCase);
        // }
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
        //this.currentGroupName = groupName;
        this.currentGroup = group;
    }
    unsetCurrentGroup() {
        this.currentGroup = undefined;
    }
    setCurrentFilePath(filePath) {
        //console.log("setCurrentFilePath:", filePath);
        this.currentFilePath = filePath;
        //console.log("currentFilePath:", this.currentFilePath);
    }
    unsetCurrentFilePath() {
        //console.log("unsetCurrentFilePath:", this.currentFilePath);
        this.currentFilePath = undefined;
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
            ...envOptions, // env options take precedence over global options
            ...(this.currentGroup?.options ?? {}),
            url: processUrl(envOptions.url, this.globalOptions.url, this.currentGroup?.options?.url)
        };
    }
    async loadTestFile(absoluteFilePath, relativeFilePath) {
        // adding this back in causes ES module err
        //logUpdate("foo")
        try {
            // Set current file path in registry
            this.setCurrentFilePath(relativeFilePath);
            // Compile the file
            const compiledPath = await this.compiler.compileFile(absoluteFilePath);
            // Import the compiled file - triggering it to register its test cases
            await import(pathToFileURL(compiledPath).href);
            //console.log(`Loaded test file: ${relativeFilePath}`);
            // Notify the viewer about the loaded file
            //this.viewer.addLoadedFile(relativeFilePath);
        }
        catch (error) {
            console.error(`Failed to load test file ${relativeFilePath}:`, error);
            throw error;
        }
        finally {
            // Always unset the current file path when done
            this.unsetCurrentFilePath();
        }
    }
}
export default TestRegistry;
