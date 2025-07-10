/**
 * Generates a unique identifier for a test case.
 * @param filepath - The path to the test file.
 * @param groupName - The name of the test group (or null if ungrouped).
 * @param title - The title of the test case.
 * @returns A unique string identifier.
 */
/**
 * Formats a duration in milliseconds into a human-readable string (e.g., "1.23s", "456ms").
 * @param ms - The duration in milliseconds.
 * @returns A formatted string representation of the duration.
 */
export declare function formatDuration(ms: number | undefined): string;
/**
 * Creates the initial state object for all tests, marking them as pending.
 * @param tests - The categorized test cases discovered.
 * @returns An AllTestStates object with all tests set to 'pending'.
 */
