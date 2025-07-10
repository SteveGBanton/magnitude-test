import EventEmitter from "eventemitter3";
import { TestCaseAgent } from "@/agent";
import { buildDefaultBrowserAgentOptions } from "magnitude-core";
import { TestStateTracker } from "./state";
import { sendTelemetry } from "./telemetry";
export class TestRunner {
    /**
     * Responsible for running one test case using a browser agent.
     * Rendering-agnostic
     */
    events;
    //private browser: Browser;
    test;
    options;
    // constructor(browser: Browser, test: RegisteredTest) {
    //     this.browser = browser;
    //     this.test = test;
    //     this.events = new EventEmitter();
    // }
    constructor(test, options) {
        //this.browser = browser;
        this.test = test;
        this.options = options;
        this.events = new EventEmitter();
    }
    // Should not throw, return some val repr pass or fail
    async run() {
        // const agent = await startTestCaseAgent({
        //     url: this.test.url,
        //     browser: this.options.browser,
        //     llm: this.options.llm,
        //     grounding: this.options.grounding,
        //     browserContextOptions: this.options.browserContextOptions
        // });
        const { agentOptions, browserOptions } = buildDefaultBrowserAgentOptions({
            agentOptions: {
                llm: this.options.llm
            },
            browserOptions: {
                url: this.test.url,
                browser: this.options.browserOptions,
                grounding: this.options.grounding,
                //browserContextOptions: this.options.browserContextOptions
            }
        });
        const agent = new TestCaseAgent({
            // disable telemetry to keep test run telemetry seperate from general automation telemetry
            agentOptions: { ...agentOptions, telemetry: false },
            browserOptions: browserOptions,
        });
        const tracker = new TestStateTracker(agent);
        // forward test state changed event
        tracker.events.on('stateChanged', (state) => this.events.emit('stateChanged', state), this);
        await agent.start();
        // const context: TestFunctionContext = {
        //     ai: agent,//new Magnus(agent),
        //     get page(): Page {
        //         return agent.page;
        //     },
        //     get context(): BrowserContext {
        //         return agent.context;
        //     }
        // }
        try {
            await this.test.fn(agent);
        }
        catch (err) {
            let failure;
            if (err instanceof Error) {
                failure = { message: err.message };
            }
            else {
                failure = { message: String(err) }; // Ensure string conversion
            }
            // Get the current state, add failure, and set status to 'failed'
            const finalStateFailed = {
                ...tracker.getState(),
                failure: failure,
                status: 'failed',
                doneAt: Date.now()
            };
            this.events.emit('stateChanged', finalStateFailed);
            await agent.stop();
            if (this.options.telemetry)
                await sendTelemetry(finalStateFailed);
            return {
                passed: false,
                failure: failure
            };
        }
        await agent.stop();
        // If no error, test passed
        // Get the current state and set status to 'passed'
        const finalStatePassed = {
            ...tracker.getState(),
            status: 'passed',
            doneAt: Date.now()
        };
        this.events.emit('stateChanged', finalStatePassed);
        if (this.options.telemetry)
            await sendTelemetry(finalStatePassed);
        return { passed: true };
    }
}
