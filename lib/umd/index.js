(function (g, f) {
    if ("object" == typeof exports && "object" == typeof module) {
      module.exports = f();
    } else if ("function" == typeof define && define.amd) {
      define("ReplRender", [], f);
    } else if ("object" == typeof exports) {
      exports["ReplRender"] = f();
    } else {
      g["ReplRender"] = f();
    }
  }(this, () => {
var exports = {};
var module = { exports };
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DefaultHandleVars: () => DefaultHandleVars,
  DefaultOnNullText: () => DefaultOnNullText,
  DefaultRegExp: () => DefaultRegExp,
  createEngine: () => createEngine,
  default: () => src_default,
  render: () => render,
  renderFile: () => renderFile
});
module.exports = __toCommonJS(src_exports);

// src/renderer.ts
var import_fs = __toESM(require("fs"));
var DefaultOnNullText = /* @__PURE__ */ __name(function(oldVal = "", key = "", currInp = {}, currKey = "", str = "", inp = {}) {
  return oldVal;
}, "DefaultOnNullText");
var DefaultHandleVars = /* @__PURE__ */ __name(function(token, key, initResult) {
  return initResult;
}, "DefaultHandleVars");
var DefaultRegExp = /{{(.+?)}}|\(\((.+?)\)\)|<var var="(.+?)"\/>/g;
var DefaultOpts = {
  regex: DefaultRegExp,
  nullHandler: DefaultOnNullText,
  variableHandler: DefaultHandleVars,
  encoding: "utf8"
};
function createEngine(opts = DefaultOpts) {
  let {
    regex = DefaultRegExp,
    nullHandler = DefaultOnNullText,
    variableHandler = DefaultHandleVars,
    encoding = "utf8"
  } = opts;
  let engine = /* @__PURE__ */ __name((filePath, opts2, callback) => {
    import_fs.default.promises.readFile(filePath).then((content) => {
      if (!Buffer.isEncoding(encoding)) {
        encoding = "utf8";
      }
      let str = content.toString(encoding);
      let rend = renderText(str, opts2, regex, nullHandler, variableHandler);
      return callback(null, rend);
    }).catch((err) => {
      if (err)
        return callback(err);
    });
  }, "engine");
  return engine;
}
__name(createEngine, "createEngine");
function render(input, data, opts = DefaultOpts) {
  let {
    regex = DefaultRegExp,
    nullHandler = DefaultOnNullText,
    variableHandler = DefaultHandleVars
  } = opts;
  let renderedStr = renderText(input, data, regex, nullHandler, variableHandler);
  return renderedStr;
}
__name(render, "render");
async function renderFile(filePath, data, opts = DefaultOpts, callback = (err, c) => err ? err : c) {
  let {
    regex = DefaultRegExp,
    nullHandler = DefaultOnNullText,
    variableHandler = DefaultHandleVars,
    encoding = "utf8"
  } = opts;
  return import_fs.default.promises.readFile(filePath).then((content) => {
    if (!Buffer.isEncoding(encoding)) {
      encoding = "utf8";
    }
    let str = content.toString(encoding);
    let rend = renderText(str, data, regex, nullHandler, variableHandler);
    return callback(null, rend);
  }).catch((err) => {
    if (err)
      throw callback(err, null);
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

// src/index.ts
var src_default = {
  render,
  renderFile,
  createEngine,
  DefaultRegExp,
  DefaultHandleVars,
  DefaultOnNullText
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultHandleVars,
  DefaultOnNullText,
  DefaultRegExp,
  createEngine,
  render,
  renderFile
});
if (typeof module.exports == "object" && typeof exports == "object") {
  var __cp = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of Object.getOwnPropertyNames(from)) {
        if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
        Object.defineProperty(to, key, {
          get: () => from[key],
          enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
        });
      }
    }
    return to;
  };
  module.exports = __cp(module.exports, exports);
}
return module.exports;
}))
