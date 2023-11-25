var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import fs from "fs";
const DefaultOnNullText = /* @__PURE__ */ __name(function(oldVal = "", key = "", currInp = {}, currKey = "", str = "", inp = {}) {
  return oldVal;
}, "DefaultOnNullText");
const DefaultHandleVars = /* @__PURE__ */ __name(function(token, key, initResult) {
  return initResult;
}, "DefaultHandleVars");
const DefaultRegExp = /{{(.+?)}}|\(\((.+?)\)\)|<var var="(.+?)"\/>/g;
function createEngine({
  regex = DefaultRegExp,
  nullHandler = DefaultOnNullText,
  variableHandler = DefaultHandleVars,
  encoding = "utf8"
}) {
  let engine = /* @__PURE__ */ __name((filePath, opts, callback) => {
    fs.promises.readFile(filePath).then((content) => {
      if (!Buffer.isEncoding(encoding)) {
        encoding = "utf8";
      }
      let str = content.toString(encoding);
      let rend = renderText(str, opts, regex, nullHandler, variableHandler);
      return callback(null, rend);
    }).catch((err) => {
      if (err)
        return callback(err);
    });
  }, "engine");
  return engine;
}
__name(createEngine, "createEngine");
function render(input, data, {
  regex = DefaultRegExp,
  nullHandler = DefaultOnNullText,
  variableHandler = DefaultHandleVars
}) {
  let renderedStr = renderText(input, data, regex, nullHandler, variableHandler);
  return renderedStr;
}
__name(render, "render");
async function renderFile(filePath, data, {
  regex = DefaultRegExp,
  nullHandler = DefaultOnNullText,
  variableHandler = DefaultHandleVars,
  encoding = "utf8"
}, callback = (c) => {
}) {
  fs.promises.readFile(filePath).then((content) => {
    if (!Buffer.isEncoding(encoding)) {
      encoding = "utf8";
    }
    let str = content.toString(encoding);
    let rend = renderText(str, data, regex, nullHandler, variableHandler);
    callback(rend);
    return rend;
  }).catch((err) => {
    if (err)
      return callback(err);
  });
}
__name(renderFile, "renderFile");
function renderText(data, vars, reg = DefaultRegExp, nullText = DefaultOnNullText, handleVars = DefaultHandleVars) {
  let onNullText = DefaultOnNullText;
  if (nullText instanceof Function) {
    onNullText = nullText;
  } else if (typeof nullText === "string") {
    onNullText = /* @__PURE__ */ __name(() => `${nullText}`, "onNullText");
  }
  let onHandleVars = DefaultHandleVars;
  if (handleVars instanceof Function) {
    onHandleVars = handleVars;
  }
  let regexp = new RegExp(reg);
  function replaceRegWithVars(str, inp, regexp2) {
    let newStr = "";
    let parseStr = str;
    let lastIndex = regexp2.lastIndex;
    let cache = {};
    function replacer(oldVal, key) {
      if (!key || key === "") {
        return onNullText(oldVal, key, inp, key, str, inp);
      }
      if (cache.hasOwnProperty(oldVal)) {
        return cache[oldVal];
      }
      key = String(key);
      let keyChain = key.split(".");
      let currInp = inp;
      let currKey = keyChain[0];
      if (keyChain.length <= 0) {
        cache[oldVal] = oldVal;
        return oldVal;
      }
      if (keyChain.length > 1) {
        let k = 0;
        while (k < keyChain.length - 1 && currInp instanceof Object) {
          currInp = currInp[keyChain[k]];
          currKey = keyChain[k + 1];
          k++;
        }
      } else if (keyChain.length == 1) {
        currInp = inp;
        currKey = keyChain[0];
      }
      let currVal = currInp[currKey] || onNullText(oldVal, key, currInp, currKey, str, inp);
      let finalVal;
      if (currVal instanceof Function) {
        finalVal = currVal(oldVal, key, currInp, currKey, str, inp);
      } else {
        finalVal = String(currVal);
      }
      cache[oldVal] = finalVal;
      return finalVal;
    }
    __name(replacer, "replacer");
    let arr;
    while ((arr = regexp2.exec(parseStr)) !== null) {
      regexp2.lastIndex = 0;
      let token = arr.shift();
      let key = (() => {
        while (arr.length) {
          let x = arr.pop();
          if (x !== void 0)
            return String(x);
        }
        return token;
      })();
      let res = replacer(token, key);
      res = onHandleVars(token, key, res);
      let parseArr = parseStr.split(token);
      newStr += parseArr.shift() + res;
      parseStr = parseArr.join(token);
    }
    newStr += parseStr;
    return newStr;
  }
  __name(replaceRegWithVars, "replaceRegWithVars");
  let result = replaceRegWithVars(data, vars, regexp);
  return result;
}
__name(renderText, "renderText");
export {
  DefaultHandleVars,
  DefaultOnNullText,
  DefaultRegExp,
  createEngine,
  render,
  renderFile
};
