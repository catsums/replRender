"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOnNullText = exports.DefaultHandleVars = exports.DefaultRegExp = exports.createEngine = exports.renderFile = exports.render = void 0;
var renderer_1 = require("./renderer");
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return renderer_1.render; } });
Object.defineProperty(exports, "renderFile", { enumerable: true, get: function () { return renderer_1.renderFile; } });
Object.defineProperty(exports, "createEngine", { enumerable: true, get: function () { return renderer_1.createEngine; } });
Object.defineProperty(exports, "DefaultRegExp", { enumerable: true, get: function () { return renderer_1.DefaultRegExp; } });
Object.defineProperty(exports, "DefaultHandleVars", { enumerable: true, get: function () { return renderer_1.DefaultHandleVars; } });
Object.defineProperty(exports, "DefaultOnNullText", { enumerable: true, get: function () { return renderer_1.DefaultOnNullText; } });
const renderer_2 = require("./renderer");
exports.default = {
    render: renderer_2.render, renderFile: renderer_2.renderFile, createEngine: renderer_2.createEngine, DefaultRegExp: renderer_2.DefaultRegExp, DefaultHandleVars: renderer_2.DefaultHandleVars, DefaultOnNullText: renderer_2.DefaultOnNullText
};
