import { type ChildProcess } from 'node:child_process';
import { WebServerConfig } from './discovery/types';
export declare function isServerRunning(url: string): Promise<boolean>;
export declare function startWebServer(config: WebServerConfig): Promise<ChildProcess | null>;
export declare function stopWebServer(proc: ChildProcess | null | undefined): void;
export declare function startWebServers(configs: WebServerConfig | WebServerConfig[]): Promise<(ChildProcess | null)[]>;
export declare function stopWebServers(procs: (ChildProcess | null | undefined)[]): void;
