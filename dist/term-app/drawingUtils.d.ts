import { TestState } from '@/runner/state';
/**
 * Calculate the visible length of a string, accounting for ANSI escape codes.
 * @param s The string to calculate the length for
 * @returns The visible length of the string
 */
export declare const str: (s: string) => number;
/**
 * Get the status indicator character for a test.
 * @param status Test status
 * @returns Plain character symbol
 */
export declare function getTestStatusIndicatorChar(status: TestState['status']): string;
/**
 * Get the status indicator character for a step.
 * @param status Step status
 * @returns Plain character symbol
 */
export declare function getStepStatusIndicatorChar(status: TestState['status']): string;
/**
 * Get the status indicator character for a check.
 * @param status Check status
 * @returns Plain character symbol
 */
export declare function getCheckStatusIndicatorChar(status: TestState['status']): string;
/**
 * Apply styling to text based on status and type.
 * @param status The status to style for
 * @param text The text to style
 * @param type The type of element being styled
 * @returns String with ANSI codes
 */
export declare function styleAnsi(status: TestState['status'], text: string, type: 'test' | 'step' | 'check'): string;
