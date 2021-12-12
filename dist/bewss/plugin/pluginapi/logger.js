"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class logger {
    constructor(pluginAPI, color) {
        this.pluginAPI = pluginAPI;
        this.color = color;
    }
    success(...content) {
        console.log(`${chalk_1.default.gray(moment_1.default().format("HH:mm:ss"))} ${chalk_1.default.blue("[PluginApi]")} ${chalk_1.default[this.color](`[${this.pluginAPI.config.displayName || this.pluginAPI.path}]`)} ${chalk_1.default.green("[Success]")}`, ...content);
    }
    info(...content) {
        console.log(`${chalk_1.default.gray(moment_1.default().format("HH:mm:ss"))} ${chalk_1.default.blue("[PluginApi]")} ${chalk_1.default[this.color](`[${this.pluginAPI.config.displayName || this.pluginAPI.path}]`)} ${chalk_1.default.cyan("[Info]")}`, ...content);
    }
    warn(...content) {
        console.log(`${chalk_1.default.gray(moment_1.default().format("HH:mm:ss"))} ${chalk_1.default.blue("[PluginApi]")} ${chalk_1.default[this.color](`[${this.pluginAPI.config.displayName || this.pluginAPI.path}]`)} ${chalk_1.default.yellow("[Warn]")}`, ...content);
    }
    error(...content) {
        console.log(`${chalk_1.default.gray(moment_1.default().format("HH:mm:ss"))} ${chalk_1.default.blue("[PluginApi]")} ${chalk_1.default[this.color](`[${this.pluginAPI.config.displayName || this.pluginAPI.path}]`)} ${chalk_1.default.red("[Error]")}`, ...content);
    }
}
exports.default = logger;
