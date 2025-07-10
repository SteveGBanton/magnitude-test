// packages/magnitude-test/src/runner/workerPool.ts
/**
 * A simple worker pool to run async tasks with a concurrency limit and support for early abortion.
 */
export class WorkerPool {
    concurrency;
    /**
     * Creates an instance of WorkerPool.
     * @param concurrency The maximum number of tasks to run concurrently. Must be at least 1.
     */
    constructor(concurrency) {
        this.concurrency = Math.max(1, concurrency);
    }
    /**
     * Runs the given asynchronous tasks with the specified concurrency.
     *
     * @template T The type of the result returned by each task.
     * @param tasks An array of functions, each returning a Promise<T>. Each function receives an AbortSignal.
     * @param checkResultForAbort An optional function that checks the result of a completed task. If it returns true, the pool will abort further processing.
     * @returns A Promise resolving to a WorkerPoolResult<T> object.
     */
    async runTasks(tasks, checkResultForAbort = () => false) {
        const abortController = new AbortController();
        const { signal } = abortController;
        const taskQueue = tasks.map((task, index) => ({ task, index }));
        const results = new Array(tasks.length).fill(undefined);
        const runningWorkers = new Set();
        const runWorker = async () => {
            while (taskQueue.length > 0) {
                if (signal.aborted) {
                    break; // Stop processing if aborted
                }
                const taskItem = taskQueue.shift();
                if (!taskItem)
                    continue; // Should not happen if queue.length > 0
                const { task, index } = taskItem;
                try {
                    // Check signal *before* starting the potentially long task
                    if (signal.aborted) {
                        // Task skipped due to prior abort
                        continue;
                    }
                    const result = await task(signal);
                    results[index] = result;
                    // Check if this result triggers an abort, only if not already aborted
                    if (!signal.aborted && checkResultForAbort(result)) {
                        abortController.abort();
                    }
                }
                catch (error) {
                    results[index] = undefined; // Mark result as undefined on error
                    if (!signal.aborted) {
                        abortController.abort(); // Abort on any task error
                    }
                }
            }
        };
        const startWorkers = () => {
            while (runningWorkers.size < this.concurrency && taskQueue.length > 0 && !signal.aborted) {
                const workerPromise = runWorker().finally(() => {
                    runningWorkers.delete(workerPromise);
                    // If not aborted and there are still tasks, try starting another worker
                    // This ensures we maintain concurrency level when a worker finishes
                    if (!signal.aborted && taskQueue.length > 0) {
                        startWorkers();
                    }
                });
                runningWorkers.add(workerPromise);
            }
        };
        startWorkers(); // Kick off the initial workers
        // Wait for all active workers to complete their current task or stop due to abort
        // We need to wait until the set is empty, indicating all started workers have finished.
        while (runningWorkers.size > 0) {
            try {
                // Wait for any worker to finish
                await Promise.race(runningWorkers);
            }
            catch (e) {
                // Errors within tasks are caught inside runWorker,
                // this catch is for unexpected issues with Promise.race or the worker management itself.
                console.error("Unexpected error waiting for worker:", e);
                if (!signal.aborted) {
                    abortController.abort();
                }
            }
        }
        // Final check: If the queue still has items, it means we aborted early.
        const completed = !signal.aborted && taskQueue.length === 0;
        // Caller (TestRunner) is responsible for handling UI updates for cancelled tasks based on results array
        return { completed, results };
    }
}
