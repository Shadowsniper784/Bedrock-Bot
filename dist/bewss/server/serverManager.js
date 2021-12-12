"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const events_1 = require("events");
class serverManager extends events_1.EventEmitter {
    constructor(bewss, port) {
        super();
        this.bewss = bewss;
        this.port = port;
    }
    async onEnabled() {
        this.startProcessTitle();
        await this.createServer();
    }
    async onDisabled() {
        clearInterval(this.inv);
        this.ws.close();
        this.emit('wssclosed');
        this.bewss.getLogger().info('Websocket server closed.');
        this.server = undefined;
        return;
    }
    async createServer() {
        return new Promise((res) => {
            this.ws = new ws_1.default.Server({ port: this.port });
            this.ws.on('listening', () => {
                this.emit('wsslistening');
                this.bewss.getLogger().info(`Websocket server started! To connect to your server do "/connect 127.0.0.1:${this.port}" in your Minecraft world.`);
            });
            this.ws.on('connection', (server) => {
                this.server = server;
                this.emit('wssconnected');
                this.server.setMaxListeners(50);
                this.bewss.getLogger().info('User connected to the server!');
                this.bewss.getLogger().info('Do -help for a list of BeWss commands, do /help for a list of Bedrock commands.');
            });
            this.ws.on('error', (err) => {
                this.emit('wsserror', err);
                this.bewss.getLogger().error("Failed to open ws server on port", this.port + ".", "Incrementing port by 1 and attempting again in 5.00s");
                setTimeout(() => {
                    this.port++;
                    this.createServer();
                }, 5000);
                res();
            });
        });
    }
    startProcessTitle() {
        this.inv = setInterval(() => {
            const plugins = this.bewss.getPluginManager().getPlugins();
            let pluginDisplay = plugins.join(', ');
            if (plugins.length == 0)
                pluginDisplay = 'None';
            process.title = `Minecraft Bedrock Edition - BeWss | Plugins Loaded - ${pluginDisplay}`;
        }, 10);
    }
    sendJSON(json) {
        this.server.send(JSON.stringify(json));
    }
    sendBuffer(buffer) {
        this.server.send(buffer);
    }
    getServer() {
        return this.server;
    }
}
exports.default = serverManager;
