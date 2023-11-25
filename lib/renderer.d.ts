declare global {
    interface PlainObject<T = any> {
        [key: string]: T;
    }
}
export declare const DefaultOnNullText: (oldVal?: string, key?: string, currInp?: PlainObject, currKey?: string, str?: string, inp?: PlainObject) => string;
export declare const DefaultHandleVars: (token: string, key: string, initResult: string) => string;
export declare const DefaultRegExp: RegExp;
export declare function createEngine({ regex, nullHandler, variableHandler, encoding }: {
    regex?: RegExp;
    nullHandler?: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
    variableHandler?: (token: string, key: string, initResult: string) => string;
    encoding?: string;
}): (filePath: any, opts: any, callback: any) => void;
export declare function render(input: string, data: PlainObject, { regex, nullHandler, variableHandler, }: {
    regex?: RegExp;
    nullHandler?: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
    variableHandler?: (token: string, key: string, initResult: string) => string;
}): string;
export declare function renderFile(filePath: string, data: PlainObject, { regex, nullHandler, variableHandler, encoding, }: {
    regex?: RegExp;
    nullHandler?: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
    variableHandler?: (token: string, key: string, initResult: string) => string;
    encoding?: string;
}, callback?: (c: any) => void): Promise<void>;
