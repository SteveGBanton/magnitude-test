/**
 * Represents the result of running tasks with the WorkerPool.
 * @template T The type of the result returned by each task.
 */
export interface WorkerPoolResult<T> {
    /** Indicates if all tasks were allowed to run to completion without an early abort. */
    completed: boolean;
    /**
     * An array containing the results of the tasks. The order matches the input task array.
     * If a task threw an error or the pool was aborted before the task could run or finish,
     * the corresponding element might be undefined or represent an error state,
     * depending on how tasks handle errors/cancellation.
     */
    results: Array<T | undefined>;
}
/**
 * A simple worker pool to run async tasks with a concurrency limit and support for early abortion.
 */
export declare class WorkerPool {
    private concurrency;
    /**
     * Creates an instance of WorkerPool.
     * @param concurrency The maximum number of tasks to run concurrently. Must be at least 1.
     */
    constructor(concurrency: number);
    /**
     * Runs the given asynchronous tasks with the specified concurrency.
     *
     * @template T The type of the result returned by each task.
     * @param tasks An array of functions, each returning a Promise<T>. Each function receives an AbortSignal.
     * @param checkResultForAbort An optional function that checks the result of a completed task. If it returns true, the pool will abort further processing.
     * @returns A Promise resolving to a WorkerPoolResult<T> object.
     */
    runTasks<T>(tasks: Array<(signal: AbortSignal) => Promise<T>>, checkResultForAbort?: (result: T) => boolean): Promise<WorkerPoolResult<T>>;
}
