import { TestRenderer } from "@/renderer";
import { RegisteredTest, MagnitudeConfig } from "@/discovery/types";
import { TestState } from "@/runner/state";
export declare class TermAppRenderer implements TestRenderer {
    private magnitudeConfig;
    private initialTests;
    private firstModelReportedInUI;
    private sigintListener;
    constructor(config: MagnitudeConfig, initialTests: RegisteredTest[]);
    start(): void;
    stop(): void;
    onTestStateUpdated(test: RegisteredTest, newState: TestState): void;
    private handleExitKeyPress;
}
