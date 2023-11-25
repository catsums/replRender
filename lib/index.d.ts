declare module 'replrender/index' {
  export { render, renderFile, createEngine, DefaultRegExp, DefaultHandleVars, DefaultOnNullText } from 'replrender/renderer';
  import { render, renderFile, createEngine } from 'replrender/renderer';
  const _default: {
      render: typeof render;
      renderFile: typeof renderFile;
      createEngine: typeof createEngine;
      DefaultRegExp: RegExp;
      DefaultHandleVars: (token: string, key: string, initResult: string) => string;
      DefaultOnNullText: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
  };
  export default _default;

}
declare module 'replrender/renderer' {
  global {
      interface PlainObject<T = any> {
          [key: string]: T;
      }
  }
  export const DefaultOnNullText: (oldVal?: string, key?: string, currInp?: PlainObject, currKey?: string, str?: string, inp?: PlainObject) => string;
  export const DefaultHandleVars: (token: string, key: string, initResult: string) => string;
  export const DefaultRegExp: RegExp;
  export function createEngine({ regex, nullHandler, variableHandler, encoding }: {
      regex?: RegExp;
      nullHandler?: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
      variableHandler?: (token: string, key: string, initResult: string) => string;
      encoding?: string;
  }): (filePath: any, opts: any, callback: any) => void;
  export function render(input: string, data: PlainObject, { regex, nullHandler, variableHandler, }: {
      regex?: RegExp;
      nullHandler?: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
      variableHandler?: (token: string, key: string, initResult: string) => string;
  }): string;
  export function renderFile(filePath: string, data: PlainObject, { regex, nullHandler, variableHandler, encoding, }: {
      regex?: RegExp;
      nullHandler?: (oldVal?: string, key?: string, currInp?: PlainObject<any>, currKey?: string, str?: string, inp?: PlainObject<any>) => string;
      variableHandler?: (token: string, key: string, initResult: string) => string;
      encoding?: string;
  }, callback?: (c: any) => void): Promise<void>;

}
declare module 'replrender' {
  import main = require('replrender/src/index');
  export = main;
}