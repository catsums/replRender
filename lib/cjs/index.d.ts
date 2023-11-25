export { render, renderFile, createEngine, DefaultRegExp, DefaultHandleVars, DefaultOnNullText } from './renderer';
import { render, renderFile, createEngine } from './renderer';
declare const _default: {
    render: typeof render;
    renderFile: typeof renderFile;
    createEngine: typeof createEngine;
    DefaultRegExp: RegExp;
    DefaultHandleVars: (token: string, key: string, initResult: string) => string;
    DefaultOnNullText: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
};
export default _default;
