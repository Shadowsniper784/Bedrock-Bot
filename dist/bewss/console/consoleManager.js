"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const events_1 = require("events");
const index_1 = require("./commands/index");
class consoleManager extends events_1.EventEmitter {
    constructor(bewss) {
        super();
        this.commands = new Map();
        this.bewss = bewss;
    }
    async onEnabled() {
        await this.loadDefaultCommands();
        this.readline = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.readline.on('line', (data) => {
            if (!data.startsWith('/') && !data.startsWith('-'))
                return this.bewss.getLogger().error('Invailed syntax! Use / to execute Bedrock commands, or use - to execute BEWSS commands.');
            if (data.startsWith('/') && this.bewss.getServerManager().getServer() == undefined)
                return this.bewss.getLogger().error('A user must be connect before running a Bedrock command.');
            if (data.startsWith('/'))
                return this.bewss.getEventManager().emit('ConsoleCommandExecuted', data);
            const parsedCommand = this.parseCommand(data);
            if (!this.getCommandNames().includes(parsedCommand.command))
                return this.bewss.getLogger().error('This command doesn\'t exist!');
            const commandData = this.commands.get(parsedCommand.command);
            if (commandData == undefined)
                return this.emit(parsedCommand.command, {
                    sender: "CONSOLE",
                    args: parsedCommand.args,
                });
            return commandData.execute(parsedCommand.args);
        });
        return;
    }
    async onDisabled() {
        this.readline.close();
        return;
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
        const quitCommand = new index_1.Quit(this.bewss);
        this.commands.set(quitCommand.commandName, quitCommand);
        const reindexCommand = new index_1.Reindex(this.bewss);
        this.commands.set(reindexCommand.commandName, reindexCommand);
        const reloadCommand = new index_1.Reload(this.bewss);
        this.commands.set(reloadCommand.commandName, reloadCommand);
        const restartCommand = new index_1.Restart(this.bewss);
        this.commands.set(restartCommand.commandName, restartCommand);
        const startCommand = new index_1.Start(this.bewss);
        this.commands.set(startCommand.commandName, startCommand);
        const stopCommand = new index_1.Stop(this.bewss);
        this.commands.set(stopCommand.commandName, stopCommand);
        return;
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
}
exports.default = consoleManager;
