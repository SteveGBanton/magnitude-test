import { RegisteredTest } from "@/discovery/types";
import EventEmitter from "eventemitter3";
import { BrowserOptions, GroundingClient, LLMClient } from "magnitude-core";
import { TestState, TestResult } from "./state";
export interface TestRunnerEvents {
    'stateChanged': (state: TestState) => {};
}
export interface TestRunnerOptions {
    browserOptions?: BrowserOptions;
    llm?: LLMClient;
    grounding?: GroundingClient;
    telemetry: boolean;
}
export declare class TestRunner {
    /**
     * Responsible for running one test case using a browser agent.
     * Rendering-agnostic
     */
    readonly events: EventEmitter<TestRunnerEvents>;
    private test;
    private options;
    constructor(test: RegisteredTest, options: TestRunnerOptions);
    run(): Promise<TestResult>;
}
