import logger from '@/logger';
import { getCodebaseId, getMachineId, posthog } from 'magnitude-core';
import { VERSION } from '@/version';
;
;
export async function sendTelemetry(state) {
    // const fullPayload: V1TelemetryPayload = {
    //     version: '0.1',
    //     userId: getMachineId(),
    //     ...payload
    // }
    // const jsonString = JSON.stringify(fullPayload);
    // const encodedData = btoa(jsonString);
    // const telemetryUrl = "https://telemetry.magnitude.run/functions/v1/telemetry?data=" + encodedData;
    // Transformations needed:
    // 1. Count steps and checks
    // 2. Count number of web actions
    let numSteps = 0;
    let numChecks = 0;
    let browserActionCount = 0;
    for (const item of state.stepsAndChecks) {
        if (item.variant === 'step') {
            numSteps += 1;
            for (const action of item.actions) {
                if (action.action.variant.startsWith("browser") || action.action.variant.startsWith("keyboard") || action.action.variant.startsWith("mouse")) {
                    browserActionCount += 1;
                }
            }
        }
        else {
            numChecks += 1;
        }
    }
    const userId = getMachineId();
    const codebaseId = getCodebaseId();
    if (codebaseId) {
        try {
            posthog.groupIdentify({
                groupType: 'codebase',
                groupKey: codebaseId,
                //properties: {}
            });
        }
        catch (error) {
            logger.warn(`Failed to identify group: ${error.message}`);
        }
    }
    const payload = {
        source: 'magnitude-test',
        telemetryVersion: '0.2',
        packageVersion: VERSION,
        codebase: codebaseId,
        startedAt: state.startedAt ?? Date.now(),
        doneAt: state.doneAt ?? Date.now(),
        numSteps: numSteps,
        numChecks: numChecks,
        browserActionCount: browserActionCount,
        modelUsage: state.modelUsage,
        passed: state.status === 'passed',
        failure: state.failure
    };
    // console.log("user ID:", userId);
    // console.log("codebase ID:", codebaseId);
    try {
        // const resp = await fetch(telemetryUrl, { signal: AbortSignal.timeout(3000) });
        // if (!resp.ok) {
        //     logger.warn(`Failed to send telemetry (status ${resp.status})`);
        // }
        posthog.capture({
            distinctId: userId,
            event: 'test-run',
            properties: {
                ...payload
            },
            ...(codebaseId ? { groups: { codebase: codebaseId } } : {})
            // groups: {
            //     // TODO: derive from git hash (also put it payload too)
            //     codebase: codebaseId
            // }
        });
        // does NOT wait for HTTP request to fully finish so still need client.shutdown somewhere
        //await posthog.flush();
        // shutdown waits for http request to actually finish. ideally would do this per suite instead?
        await posthog.shutdown();
    }
    catch (error) {
        logger.warn(`Failed to send telemetry (may have timed out): ${error.message}`);
    }
}
