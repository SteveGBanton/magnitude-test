export declare class TestCompiler {
    private cacheDir;
    private defaultOptions;
    constructor();
    compileFile(filePath: string): Promise<string>;
}
