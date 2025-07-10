import { BrowserOptions, GroundingClient, LLMClient } from 'magnitude-core';
import { RegisteredTest } from '@/discovery/types';
import { TestRenderer } from '@/renderer';
export interface TestSuiteRunnerConfig {
    workerCount: number;
    renderer: TestRenderer;
    llm?: LLMClient;
    grounding?: GroundingClient;
    browserOptions?: BrowserOptions;
    telemetry: boolean;
}
export declare class TestSuiteRunner {
    private config;
    private tests;
    constructor(config: TestSuiteRunnerConfig, tests: RegisteredTest[]);
    runTests(): Promise<void>;
}
