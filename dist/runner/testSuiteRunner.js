// Removed React import
import logger from '@/logger';
import { WorkerPool } from './workerPool';
import { TestRunner } from './testRunner';
// export const DEFAULT_CONFIG = {
//     workerCount: 1,
//     prettyDisplay: true,
//     browserContextOptions: {},
//     browserLaunchOptions: {},
//     telemetry: true,
//     downscalingRatio: 0.75,
// };
export class TestSuiteRunner {
    config;
    tests; //CategorizedTestCases;
    // private testStates: AllTestStates;
    // private updateUI: UpdateUIFunction;
    // private cleanupUI: CleanupUIFunction;
    constructor(config, tests) {
        this.config = config;
        //this.config = { ...DEFAULT_CONFIG, ...config };
        this.tests = tests;
        // this.testStates = testStates;
        // this.updateUI = updateUI;
        // this.cleanupUI = cleanupUI;
    }
    async runTests() {
        // const browser = await chromium.launch({ 
        //     headless: false, // Consider making this configurable via this.config
        //     args: ['--disable-gpu'], 
        //     ...this.config.browserLaunchOptions 
        // });
        const workerPool = new WorkerPool(this.config.workerCount);
        const testsToRun = this.tests;
        const taskFunctions = testsToRun.map((test) => {
            return async (signal) => {
                const runner = new TestRunner(test, {
                    browserOptions: this.config.browserOptions,
                    //browser: browser,
                    llm: this.config.llm,
                    grounding: this.config.grounding,
                    //browserContextOptions: this.config.browserContextOptions,
                    telemetry: this.config.telemetry
                });
                runner.events.on('stateChanged', (state) => {
                    try {
                        this.config.renderer.onTestStateUpdated(test, state);
                    }
                    catch (err) {
                        // shouldn't happen
                        if (err instanceof Error) {
                            logger.error(`Error updating test state:\n${err.message}`);
                        }
                        else {
                            logger.error(`Error updating test state:\n${err}`);
                        }
                        throw err;
                    }
                });
                //return await runner.run();
                try {
                    return await runner.run();
                }
                catch (err) {
                    // user-facing, can happen e.g. when URL is not running
                    if (err instanceof Error) {
                        console.error(`Unexpected error during test '${test.title}':\n${err.message}`);
                    }
                    else {
                        console.error(`Unexpected error during test '${test.title}':\n${err}`);
                    }
                    throw err;
                }
            };
        });
        let overallSuccess = true;
        try {
            const poolResult = await workerPool.runTasks(taskFunctions, (taskOutcome) => !taskOutcome.passed);
            for (const result of poolResult.results) {
                if (result === undefined || !result.passed) {
                    overallSuccess = false;
                    break;
                }
            }
            if (!poolResult.completed) { // If pool aborted for any reason (incl. a task failure)
                overallSuccess = false;
            }
        }
        catch (error) {
            overallSuccess = false;
        }
        finally {
            //await browser.close();
            process.exit(overallSuccess ? 0 : 1);
        }
    }
}
