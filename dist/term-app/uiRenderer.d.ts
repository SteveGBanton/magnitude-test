import { RegisteredTest } from '@/discovery/types';
import { TestFailure, TestState as RunnerTestState } from '@/runner/state';
import { AllTestStates } from './types';
/**
 * Generate the title bar portion of the UI
 * @returns Array of strings with ANSI codes representing the title bar
 */
export declare function generateTitleBarString(): string[];
/**
 * Generate a string representation of a failure
 */
export declare function generateFailureString(failure: TestFailure, indent: number): string[];
/**
 * Generate a string representation of a test
 */
export declare function generateTestString(test: RegisteredTest, state: RunnerTestState, indent: number): string[];
/**
 * Generate the test list portion of the UI
 */
export declare function generateTestListString(): string[];
/**
 * Generate the summary portion of the UI
 */
export declare function generateSummaryString(): string[];
/**
 * Calculate the height needed for the test list (now just line count)
 */
export declare function calculateTestListHeight(tests: RegisteredTest[], testStates: AllTestStates): number;
/**
 * Calculate the height needed for the summary (now just line count)
 */
export declare function calculateSummaryHeight(testStates: AllTestStates): number;
/**
 * Main function to redraw the UI
 */
export declare function redraw(): void;
/**
 * Schedule a UI redraw if one is not already scheduled
 */
export declare function scheduleRedraw(): void;
