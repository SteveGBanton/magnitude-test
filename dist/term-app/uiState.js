import { spinnerChars as localSpinnerChars } from './constants'; // Import and alias
// --- UI State ---
// Export spinnerChars so TermAppRenderer can access it via uiState.spinnerChars
export const spinnerChars = localSpinnerChars;
// currentWidth removed as it's no longer used for layout
export let redrawScheduled = false;
export let renderSettings = { showActions: true };
export let timerInterval = null;
export let currentTestStates = {};
export let allRegisteredTests = []; // Changed from currentTests
export let currentModel = '';
export let elapsedTimes = {};
export let isFinished = false;
export let spinnerFrame = 0;
export let lastOutputLineCount = 0; // Track lines for stability
export let isFirstDraw = true; // Flag to handle the first redraw specially
// resizeTimeout removed
// isResizing removed
/**
 * Resets all UI state to initial values
 */
export function resetState() {
    // currentWidth reset removed
    redrawScheduled = false;
    renderSettings = { showActions: true }; // Reset render settings
    timerInterval = null;
    currentTestStates = {};
    allRegisteredTests = []; // Changed from currentTests
    currentModel = '';
    elapsedTimes = {};
    isFinished = false;
    spinnerFrame = 0;
    lastOutputLineCount = 0;
    isFirstDraw = true;
    // resizeTimeout reset removed
    // isResizing reset removed
}
/**
 * Sets the redrawScheduled flag
 */
export function setRedrawScheduled(value) {
    redrawScheduled = value;
}
/**
 * Sets the lastOutputLineCount
 */
export function setLastOutputLineCount(count) {
    lastOutputLineCount = count;
}
/**
 * Sets the isFirstDraw flag
 */
export function setIsFirstDraw(value) {
    isFirstDraw = value;
}
// setCurrentWidth removed
// setIsResizing removed
// setResizeTimeout removed
/**
 * Sets the currentModel
 */
export function setCurrentModel(model) {
    currentModel = model;
}
/**
 * Sets the allRegisteredTests
 */
export function setAllRegisteredTests(tests) {
    allRegisteredTests = tests;
}
/**
 * Sets the currentTestStates
 */
export function setCurrentTestStates(states) {
    currentTestStates = states;
}
/**
 * Sets the timerInterval
 */
export function setTimerInterval(interval) {
    timerInterval = interval;
}
/**
 * Sets the spinnerFrame
 */
export function setSpinnerFrame(frame) {
    spinnerFrame = frame;
}
/**
 * Sets the elapsedTimes
 */
export function setElapsedTimes(times) {
    elapsedTimes = times;
}
/**
 * Updates a specific entry in the elapsedTimes map
 */
export function updateElapsedTime(testId, time) {
    elapsedTimes[testId] = time;
}
/**
 * Sets the isFinished flag
 */
export function setIsFinished(value) {
    isFinished = value;
}
/**
 * Sets the renderSettings
 */
export function setRenderSettings(settings) {
    renderSettings = settings;
}
