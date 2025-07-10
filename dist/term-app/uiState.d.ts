import { RegisteredTest } from '@/discovery/types';
import { AllTestStates } from './types';
export declare const spinnerChars: string[];
export interface RenderSettings {
    showActions: boolean;
}
export declare let redrawScheduled: boolean;
export declare let renderSettings: RenderSettings;
export declare let timerInterval: NodeJS.Timeout | null;
export declare let currentTestStates: AllTestStates;
export declare let allRegisteredTests: RegisteredTest[];
export declare let currentModel: string;
export declare let elapsedTimes: {
    [testId: string]: number;
};
export declare let isFinished: boolean;
export declare let spinnerFrame: number;
export declare let lastOutputLineCount: number;
export declare let isFirstDraw: boolean;
/**
 * Resets all UI state to initial values
 */
export declare function resetState(): void;
/**
 * Sets the redrawScheduled flag
 */
export declare function setRedrawScheduled(value: boolean): void;
/**
 * Sets the lastOutputLineCount
 */
export declare function setLastOutputLineCount(count: number): void;
/**
 * Sets the isFirstDraw flag
 */
export declare function setIsFirstDraw(value: boolean): void;
/**
 * Sets the currentModel
 */
export declare function setCurrentModel(model: string): void;
/**
 * Sets the allRegisteredTests
 */
export declare function setAllRegisteredTests(tests: RegisteredTest[]): void;
/**
 * Sets the currentTestStates
 */
export declare function setCurrentTestStates(states: AllTestStates): void;
/**
 * Sets the timerInterval
 */
export declare function setTimerInterval(interval: NodeJS.Timeout | null): void;
/**
 * Sets the spinnerFrame
 */
export declare function setSpinnerFrame(frame: number): void;
/**
 * Sets the elapsedTimes
 */
export declare function setElapsedTimes(times: {
    [testId: string]: number;
}): void;
/**
 * Updates a specific entry in the elapsedTimes map
 */
export declare function updateElapsedTime(testId: string, time: number): void;
/**
 * Sets the isFinished flag
 */
export declare function setIsFinished(value: boolean): void;
/**
 * Sets the renderSettings
 */
export declare function setRenderSettings(settings: RenderSettings): void;
