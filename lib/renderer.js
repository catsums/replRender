"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderFile = exports.render = exports.createEngine = exports.DefaultRegExp = exports.DefaultHandleVars = exports.DefaultOnNullText = void 0;
const fs_1 = __importDefault(require("fs"));
const DefaultOnNullText = function (oldVal = '', key = '', currInp = {}, currKey = '', str = '', inp = {}) {
    return oldVal;
};
exports.DefaultOnNullText = DefaultOnNullText;
const DefaultHandleVars = function (token, key, initResult) {
    return initResult;
};
exports.DefaultHandleVars = DefaultHandleVars;
exports.DefaultRegExp = /{{(.+?)}}|\(\((.+?)\)\)|<var var="(.+?)"\/>/g;
let DefaultOpts = {
    regex: exports.DefaultRegExp,
    nullHandler: exports.DefaultOnNullText,
    variableHandler: exports.DefaultHandleVars,
    encoding: 'utf8',
};
function createEngine(opts = DefaultOpts) {
    let { regex = exports.DefaultRegExp, nullHandler = exports.DefaultOnNullText, variableHandler = exports.DefaultHandleVars, encoding = 'utf8', } = opts;
    let engine = (filePath, opts, callback) => {
        fs_1.default.promises.readFile(filePath).then((content) => {
            if (!Buffer.isEncoding(encoding)) {
                encoding = 'utf8';
            }
            let str = content.toString(encoding);
            let rend = renderText(str, opts, regex, nullHandler, variableHandler);
            return callback(null, rend);
        }).catch((err) => {
            if (err)
                return callback(err);
        });
    };
    return engine;
}
exports.createEngine = createEngine;
function render(input, data, opts = DefaultOpts) {
    let { regex = exports.DefaultRegExp, nullHandler = exports.DefaultOnNullText, variableHandler = exports.DefaultHandleVars, } = opts;
    let renderedStr = renderText(input, data, regex, nullHandler, variableHandler);
    return renderedStr;
}
exports.render = render;
async function renderFile(filePath, data, opts = DefaultOpts, callback = (err, c) => (err ? err : c)) {
    let { regex = exports.DefaultRegExp, nullHandler = exports.DefaultOnNullText, variableHandler = exports.DefaultHandleVars, encoding = 'utf8', } = opts;
    return fs_1.default.promises.readFile(filePath).then((content) => {
        if (!Buffer.isEncoding(encoding)) {
            encoding = 'utf8';
        }
        let str = content.toString(encoding);
        let rend = renderText(str, data, regex, nullHandler, variableHandler);
        return callback(null, rend);
    }).catch((err) => {
        if (err)
            throw callback(err, null);
    });
}
exports.renderFile = renderFile;
function renderText(data, vars, reg = exports.DefaultRegExp, nullText = exports.DefaultOnNullText, handleVars = exports.DefaultHandleVars) {
    let onNullText = exports.DefaultOnNullText;
    if (nullText instanceof Function) {
        onNullText = nullText;
    }
    else if (typeof nullText === 'string') {
        onNullText = () => `${nullText}`;
    }
    let onHandleVars = exports.DefaultHandleVars;
    if (handleVars instanceof Function) {
        onHandleVars = handleVars;
    }
    let regexp = new RegExp(reg);
    function replaceRegWithVars(str, inp, regexp) {
        let newStr = "";
        let parseStr = str;
        let lastIndex = regexp.lastIndex;
        let cache = {};
        function replacer(oldVal, key) {
            if (!key || key === '') {
                return onNullText(oldVal, key, inp, key, str, inp);
            }
            if (cache.hasOwnProperty(oldVal)) {
                return cache[oldVal];
            }
            key = String(key);
            let keyChain = key.split(".");
            let currInp = inp;
            let currKey = keyChain[0];
            // console.log(`currInp: ${JSON.stringify(currInp)}, currKey: ${currKey}`);
            if (keyChain.length <= 0) {
                cache[oldVal] = oldVal;
                return oldVal;
            }
            if (keyChain.length > 1) {
                let k = 0;
                while (k < keyChain.length - 1 && (currInp instanceof Object)) {
                    currInp = currInp[keyChain[k]];
                    currKey = keyChain[k + 1];
                    k++;
                }
            }
            else if (keyChain.length == 1) {
                currInp = inp;
                currKey = keyChain[0];
            }
            let currVal = (currInp[currKey] || onNullText(oldVal, key, currInp, currKey, str, inp));
            let finalVal;
            if ((currVal instanceof Function)) {
                finalVal = currVal(oldVal, key, currInp, currKey, str, inp);
            }
            else {
                finalVal = String(currVal);
            }
            cache[oldVal] = finalVal;
            return finalVal;
        }
        // console.log(`newStr: ${newStr} \t parseStr:${parseStr}`);
        let arr;
        while ((arr = regexp.exec(parseStr)) !== null) {
            regexp.lastIndex = 0;
            // regexp.lastIndex = lastIndex;
            let token = arr.shift();
            let key = (() => {
                while (arr.length) {
                    let x = arr.pop();
                    if (x !== undefined)
                        return String(x);
                }
                return token;
            })();
            let res = replacer(token, key);
            res = onHandleVars(token, key, res);
            // console.log(`token:${token} \t key:${key} \t res:${res}`);
            let parseArr = parseStr.split(token);
            // lastIndex = regexp.lastIndex;
            newStr += parseArr.shift() + res;
            parseStr = parseArr.join(token);
            // console.log(`newStr: ${newStr} \t parseStr:${parseStr}`);
            // newStr = newStr.replace(token, res);
        }
        newStr += parseStr;
        return newStr;
    }
    let result = replaceRegWithVars(data, vars, regexp);
    return result;
}
