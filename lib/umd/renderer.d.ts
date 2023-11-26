declare global {
    interface PlainObject<T = any> {
        [key: string]: T;
    }
}
export declare const DefaultOnNullText: (oldVal?: string, key?: string, currInp?: PlainObject, currKey?: string, str?: string, inp?: PlainObject) => string;
export declare const DefaultHandleVars: (token: string, key: string, initResult: string) => string;
export declare const DefaultRegExp: RegExp;
/**
 * Creates a view engine used to parse html (or other) file text based on a regular expression
 * @param opts Options for changing the way the renderer will be used.
 * @param opts.regex The regular expression used to parse
 * @param opts.nullHandler A function or string used to handle tokens that are null
 * @param opts.variableHandler A function used to handle values after being replacing a token with a value from the data
 * @param opts.encoding The encoding used for the files in the view
 * @returns A function that takes in a filename, the data and has a callback, in the format for Express.JS
 *
 * @example Here is where it can be used with express:
 * ```ts
 * const app = express();
 * app.engine('html', ReplRender.createEngine({ encoding: 'utf16' }));
 * ```
 */
export declare function createEngine(opts?: {
    regex?: RegExp;
    nullHandler?: any;
    variableHandler?: any;
    encoding?: string;
}): (filePath: any, opts: any, callback: any) => void;
/**
 * Transforms an input string using the replacer from the regex
 * @returns The transformed string
 *
 * @param input The input string to be transformed
 * @param data Data used to replace the tokens with the chosen strings or to run functions.
 * @param opts Options for changing the way the renderer will be used:
 * - `regex` - The regular expression used to parse
 * - `nullHandler` - A function or string used to handle tokens that are null
 * - `variableHandler` - A function used to handle values after being replacing a token with a value from the data
 * - `encoding` - The encoding used for the files in the view
 *
 * The `data` attribute may contain values that may be a string, number, boolean or another object. If the value is a function, it would simply return the function value.
 * @example The following shows data that is transformed based on functions:
 * ```ts
 * let str = '<span>The ((primary.speed))km/h ((primary.color)) ((primary.animal)) ((action)).</span>
 * let data = {
 * 	primary : {speed: 69, color: 'brown', animal: 'fox'},
 * 	action : () => { return 'jumped' },
 * }
 *
 * let renderStr = ReplRender.render(str, data, { regex : /\(\((.+?)\)\)/g });
 * ```
 */
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
