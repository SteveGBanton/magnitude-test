import { TestCaseAgent } from "@/agent";
import { Action, LLMClientIdentifier, ModelUsage } from "magnitude-core";
import EventEmitter from "eventemitter3";
export interface ActionDescriptor {
    action: Action;
    pretty: string;
}
export interface StepDescriptor {
    variant: 'step';
    description: string;
    actions: ActionDescriptor[];
    status: 'pending' | 'running' | 'passed' | 'failed' | 'cancelled';
}
export interface CheckDescriptor {
    variant: 'check';
    description: string;
    status: 'pending' | 'running' | 'passed' | 'failed' | 'cancelled';
}
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'cancelled';
export interface TestState {
    status: TestStatus;
    startedAt?: number;
    doneAt?: number;
    stepsAndChecks: (StepDescriptor | CheckDescriptor)[];
    modelUsage: {
        llm: LLMClientIdentifier;
        inputTokens: number;
        outputTokens: number;
        numCalls: number;
    }[];
    failure?: TestFailure;
}
export type TestResult = {
    passed: true;
} | {
    passed: false;
    failure: TestFailure;
};
export interface TestFailure {
    message: string;
}
export interface TestCaseEvents {
    'stateChanged': (state: TestState) => void;
}
export declare class TestStateTracker {
    /**
     * Watches agent events and uses that to construct and update a test state
     */
    private agent;
    private state;
    private lastStepOrCheck;
    readonly events: EventEmitter<TestCaseEvents>;
    constructor(agent: TestCaseAgent);
    getState(): TestState;
    onStart(): void;
    onStop(): void;
    onTokensUsed(modelUsage: ModelUsage): void;
    onActionStarted(action: Action): void;
    onActionDone(action: Action): void;
    onActStarted(task: string): void;
    onActDone(task: string): void;
    onCheckStarted(check: string): void;
    onCheckDone(check: string, passed: boolean): void;
}
