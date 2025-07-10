import { TestOptions, TestGroup, MagnitudeConfig, TestFunction, RegisteredTest } from "./types";
declare global {
    var __testRegistry: TestRegistry | undefined;
}
export declare class TestRegistry {
    private tests;
    private currentGroup?;
    private currentFilePath?;
    private globalOptions;
    private compiler;
    private constructor();
    static getInstance(): TestRegistry;
    register(testCase: {
        fn: TestFunction;
        title: string;
        url: string;
    }): void;
    getRegisteredTests(): RegisteredTest[];
    setCurrentGroup(group: TestGroup): void;
    unsetCurrentGroup(): void;
    setCurrentFilePath(filePath: string): void;
    unsetCurrentFilePath(): void;
    setGlobalOptions(options: MagnitudeConfig): void;
    getActiveOptions(): TestOptions;
    loadTestFile(absoluteFilePath: string, relativeFilePath: string): Promise<void>;
}
export default TestRegistry;
