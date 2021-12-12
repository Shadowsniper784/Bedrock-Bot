"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandManager_1 = __importDefault(require("./command/commandManager"));
const consoleManager_1 = __importDefault(require("./console/consoleManager"));
const eventManager_1 = __importDefault(require("./events/eventManager"));
const logger_1 = __importDefault(require("./logger/logger"));
const pluginManager_1 = __importDefault(require("./plugin/pluginManager"));
const serverManager_1 = __importDefault(require("./server/serverManager"));
const worldManager_1 = __importDefault(require("./world/worldManager"));
const entityManager_1 = __importDefault(require("./entity/entityManager"));
const playerManager_1 = __importDefault(require("./player/playerManager"));
const agentManager_1 = __importDefault(require("./agent/agentManager"));
const scoreboardManager_1 = __importDefault(require("./scoreboard/scoreboardManager"));
class bewss {
    constructor(options) {
        this.port = 8080;
        if (options) {
            this.port = options.port
                ? options.port
                : 8080;
        }
        this.logger = new logger_1.default();
        this.serverManager = new serverManager_1.default(this, this.port);
        this.consoleManager = new consoleManager_1.default(this);
        this.commandManager = new commandManager_1.default(this);
        this.pluginManager = new pluginManager_1.default(this);
        this.worldManager = new worldManager_1.default(this);
        this.entityManager = new entityManager_1.default(this);
        this.playerManager = new playerManager_1.default(this);
        this.agentManager = new agentManager_1.default(this);
        this.scoreboardManager = new scoreboardManager_1.default(this);
        this.eventManager = new eventManager_1.default(this);
        this.onEnabled();
    }
    async onEnabled() {
        await this.pluginManager.onEnabled();
        this.serverManager.onEnabled();
        this.consoleManager.onEnabled();
        this.commandManager.onEnabled();
        this.worldManager.onEnabled();
        this.entityManager.onEnabled();
        this.playerManager.onEnabled();
        this.agentManager.onEnabled();
        this.scoreboardManager.onEnabled();
        this.eventManager.onEnabled();
    }
    async onDisabled() {
        await this.pluginManager.onDisabled();
        await this.serverManager.onDisabled();
        await this.consoleManager.onDisabled();
        await this.commandManager.onDisabled();
        await this.worldManager.onDisabled();
        await this.entityManager.onDisabled();
        await this.playerManager.onDisabled();
        await this.agentManager.onDisabled();
        await this.scoreboardManager.onDisabled();
        await this.eventManager.onDisabled();
        setTimeout(() => {
            process.exit(0);
        }, 1500);
    }
    getLogger() {
        return this.logger;
    }
    getPluginManager() {
        return this.pluginManager;
    }
    getServerManager() {
        return this.serverManager;
    }
    getConsoleManager() {
        return this.consoleManager;
    }
    getCommandManager() {
        return this.commandManager;
    }
    getWorldManager() {
        return this.worldManager;
    }
    getEntityManager() {
        return this.entityManager;
    }
    getPlayerManager() {
        return this.playerManager;
    }
    getAgentManager() {
        return this.agentManager;
    }
    getScoreboardManager() {
        return this.scoreboardManager;
    }
    getEventManager() {
        return this.eventManager;
    }
}
exports.default = bewss;
