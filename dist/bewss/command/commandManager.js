"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const events_1 = require("events");
const index_1 = require("./commands/index");
class commandManager extends events_1.EventEmitter {
    constructor(bewss) {
        super();
        this.commandCache = [];
        this.commands = new Map();
        this._requests = new Map();
        this.bewss = bewss;
    }
    async onEnabled() {
        await this.loadDefaultCommands();
        this.bewss.getEventManager().on('ConsoleCommandExecuted', (data) => {
            const res = this.executeCommand(data);
            this.previousCommand = res;
        });
        this.bewss.getEventManager().on('SlashCommandExecutedConsole', (packet) => {
            this.cacheCommand(packet);
            if (this.previousCommand == undefined)
                return;
            if (this.previousCommand.requestId != packet.header.requestId)
                return;
            if (this.previousCommand.command.startsWith('/me'))
                return this.bewss.getLogger().info(`[External] Message Sent`);
            if (this.previousCommand.command.startsWith('/say'))
                return this.bewss.getLogger().info(`[External] ${packet.body.message}`);
            return this.bewss.getLogger().info(packet.body.statusMessage);
        });
        this.bewss.getEventManager().on('PlayerMessage', (packet) => {
            if (!packet.body.properties.Message.startsWith('-'))
                return;
            const parsedCommand = this.parseCommand(packet.body.properties.Message);
            if (!this.getCommandNames().includes(parsedCommand.command))
                return this.bewss.getPlayerManager().sendMessage('text', packet.body.properties.Sender, '§dBeWss§r §l§7>§r §cThat command doesnt exist. Do -help for a list of commands.');
            const commandData = this.commands.get(parsedCommand.command);
            if (commandData == undefined)
                return this.emit(parsedCommand.command, {
                    sender: packet.body.properties.Sender,
                    args: parsedCommand.args,
                });
            return commandData.execute(packet.body.properties.Sender, parsedCommand.args);
        });
        this._inv = setInterval(() => {
            if (this._requests.size > 0) {
                const [uuid, command] = Array.from(this._requests.entries())[0];
                if (uuid) {
                    this._requests.delete(uuid);
                    this.bewss.getServerManager().getServer()
                        .send(JSON.stringify({
                        "body": {
                            "commandLine": command,
                            "version": 1,
                        },
                        "header": {
                            "requestId": uuid,
                            "messagePurpose": "commandRequest",
                            "version": 1,
                        },
                    }));
                }
            }
        });
    }
    async onDisabled() {
        clearInterval(this._inv);
        return;
    }
    cacheCommand(packet) {
        this.commandCache.push({
            request: packet.header.requestId,
            response: packet,
        });
    }
    parseCommand(content) {
        const command = content.replace('-', '').split(' ')[0];
        const args = content.replace(`-${command} `, '').split(' ');
        return {
            command: command,
            args: args,
        };
    }
    async loadDefaultCommands() {
        const helpCommand = new index_1.Help(this.bewss);
        this.commands.set(helpCommand.commandName, helpCommand);
        const reindexCommand = new index_1.Reindex(this.bewss);
        this.commands.set(reindexCommand.commandName, reindexCommand);
        const reloadCommand = new index_1.Reload(this.bewss);
        this.commands.set(reloadCommand.commandName, reloadCommand);
    }
    findResponse(requestId) {
        return new Promise((res) => {
            const inv = setInterval(() => {
                const cache = this.commandCache.find(({ request }) => request === requestId);
                if (cache == undefined)
                    return;
                clearInterval(inv);
                return res(cache.response);
            }, 1);
        });
    }
    async executeCommand(command, callback) {
        if (this.bewss.getServerManager().getServer() == undefined)
            return this.bewss.getLogger().error('A user must be connect before running a Bedrock command.');
        try {
            const requestId = uuid_1.v4();
            this._requests.set(requestId, command);
            const response = await this.findResponse(requestId);
            if (callback) {
                return callback(undefined, response);
            }
            else {
                return new Promise((res) => {
                    res(response);
                });
            }
        }
        catch (error) {
            if (callback) {
                return callback(error, undefined);
            }
            else {
                return new Promise((res, rej) => {
                    rej(error);
                });
            }
        }
    }
    registerCommand(command) {
        if (this.getCommandNames().includes(command))
            return this.bewss.getLogger().error(`The command "${command}" is an already a registered command!`);
        this.commands.set(command, undefined);
        this.emit('CommandRegistered', { name: command });
    }
    getCommandNames() {
        return Array.from(this.commands.keys());
    }
    async reloadAll() {
        this.commands = new Map();
        await this.loadDefaultCommands();
        return;
    }
}
exports.default = commandManager;
