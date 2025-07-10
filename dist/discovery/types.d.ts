import { BrowserOptions, GroundingClient, LLMClient } from "magnitude-core";
import { TestCaseAgent } from "@/agent";
export interface TestOptions {
    url?: string;
}
export interface WebServerConfig {
    command: string;
    url: string;
    timeout?: number;
    reuseExistingServer?: boolean;
}
export type MagnitudeConfig = {
    url: string;
    llm?: LLMClient;
    grounding?: GroundingClient;
    webServer?: WebServerConfig | WebServerConfig[];
    browser?: BrowserOptions;
    telemetry?: boolean;
    display?: {
        showActions?: boolean;
    };
};
export type TestFunction = (agent: TestCaseAgent) => Promise<void>;
export type TestGroupFunction = () => void;
export interface TestGroup {
    name: string;
    options?: TestOptions;
}
export interface TestGroupDeclaration {
    (id: string, options: TestOptions, groupFn: TestGroupFunction): void;
    (id: string, groupFn: TestGroupFunction): void;
}
export interface TestDeclaration {
    (title: string, options: TestOptions, testFn: TestFunction): void;
    (title: string, testFn: TestFunction): void;
    group: TestGroupDeclaration;
}
export interface RegisteredTest {
    id: string;
    fn: TestFunction;
    title: string;
    url: string;
    filepath: string;
    group?: string;
}
