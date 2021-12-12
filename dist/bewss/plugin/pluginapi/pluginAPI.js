"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class pluginAPI {
    constructor(bewss, config, path) {
        this.color = 'red';
        this.bewss = bewss;
        this.config = config;
        this.path = path;
        this.logger = new logger_1.default(this, this.color);
    }
    setColor(color) {
        this.color = color;
    }
    getLogger(color) {
        this.logger.color = color || this.color;
        return this.logger;
    }
    getServerManager() {
        return this.bewss.getServerManager();
    }
    getConsoleManager() {
        return this.bewss.getConsoleManager();
    }
    getCommandManager() {
        return this.bewss.getCommandManager();
    }
    getWorldManager() {
        return this.bewss.getWorldManager();
    }
    getEntityManager() {
        return this.bewss.getEntityManager();
    }
    getPlayerManager() {
        return this.bewss.getPlayerManager();
    }
    getAgentManager() {
        return this.bewss.getAgentManager();
    }
    getScoreboardManager() {
        return this.bewss.getScoreboardManager();
    }
    getEventManager() {
        return this.bewss.getEventManager();
    }
}
exports.default = pluginAPI;
