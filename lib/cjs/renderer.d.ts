declare global {
    interface PlainObject<T = any> {
        [key: string]: T;
    }
}
export declare const DefaultOnNullText: (oldVal?: string, key?: string, currInp?: PlainObject, currKey?: string, str?: string, inp?: PlainObject) => string;
export declare const DefaultHandleVars: (token: string, key: string, initResult: string) => string;
export declare const DefaultRegExp: RegExp;
export declare function createEngine(opts?: {
    regex?: RegExp;
    nullHandler?: any;
    variableHandler?: any;
    encoding?: string;
}): (filePath: any, opts: any, callback: any) => void;
export declare function render(input: string, data: PlainObject, opts?: {
    regex?: RegExp;
    nullHandler?: any;
    variableHandler?: any;
}): string;
export declare function renderFile(filePath: string, data: PlainObject, opts?: {
    regex?: RegExp;
    nullHandler?: any;
    variableHandler?: any;
    encoding?: string;
}, callback?: (err: any, c: any) => any): Promise<any>;
