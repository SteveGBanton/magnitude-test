export declare function findProjectRoot(startDir?: string): Promise<string | null>;
export declare function isProjectRoot(dir: string): Promise<boolean>;
export declare function discoverTestFiles(patterns: string[], cwd?: string): Promise<string[]>;
export declare function findConfig(searchRoot: string): string | null;
export declare function readConfig(configPath: string): Promise<any>;
