import { BrowserAgent, AgentOptions, BrowserConnectorOptions } from "magnitude-core";
import EventEmitter from "eventemitter3";
export declare function startTestCaseAgent(options: AgentOptions & BrowserConnectorOptions): Promise<TestCaseAgent>;
interface CheckEvents {
    'checkStarted': (check: string) => void;
    'checkDone': (check: string, passed: boolean) => void;
}
export declare class TestCaseAgent extends BrowserAgent {
    readonly checkEvents: EventEmitter<CheckEvents>;
    check(description: string): Promise<void>;
}
export {};
