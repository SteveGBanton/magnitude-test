import { TestFailure, TestState } from '@/runner/state';
import { LLMClientIdentifier } from 'magnitude-core';
export interface TelemetryPayload {
    source: 'magnitude-test';
    telemetryVersion: string;
    packageVersion: string;
    codebase?: string;
    startedAt: number;
    doneAt: number;
    numSteps: number;
    numChecks: number;
    browserActionCount: number;
    modelUsage: {
        llm: LLMClientIdentifier;
        inputTokens: number;
        outputTokens: number;
        numCalls: number;
    }[];
    passed: boolean;
    failure?: TestFailure;
}
export interface V1TelemetryPayload {
    version: string;
    userId: string;
    startedAt: number;
    doneAt: number;
    cached: boolean;
    testCase: {
        numSteps: number;
        numChecks: number;
    };
    actionCount: number;
    macroUsage: {
        provider: string;
        model: string;
        inputTokens: number;
        outputTokens: number;
        numCalls: number;
    };
    microUsage: {
        provider: string;
        numCalls: number;
    };
    result: string;
}
export declare function sendTelemetry(state: TestState): Promise<void>;
