"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class scoreboardManager {
    constructor(bewss) {
        this.bewss = bewss;
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    async createObjective(objective, displayname) {
        const command = await this.bewss.getCommandManager().executeCommand(`/scoreboard objectives add ${objective} dummy "${displayname}"`);
        if (command.body.statusCode == -2147483648)
            return;
        return command;
    }
    async removeObjective(objective) {
        const command = await this.bewss.getCommandManager().executeCommand(`/scoreboard objectives remove ${objective}`);
        if (command.body.statusCode == -2147483648)
            return;
        return command;
    }
    async setdisplay(objective, display, layout) {
        const command = await this.bewss.getCommandManager().executeCommand(`/scoreboard objectives setdisplay ${display} ${objective} ${layout}`);
        if (command.body.statusCode == -2147483648)
            return;
        return command;
    }
    async getObjectives() {
        const command = await this.bewss.getCommandManager().executeCommand(`/scoreboard objectives list`);
        if (command.body.statusCode == -2147483648)
            return;
        const raw = command.body.statusMessage.split('\n');
        const objectives = [];
        for await (const string of raw) {
            if (!string.startsWith("§a")) {
                const rawString = string.split(' ');
                objectives.push([rawString[1].replace(':', ''), string.replace(`- ${rawString[1].replace(':', '')}: displays as '`, '').replace(`' and is type 'dummy'`, '')]);
            }
        }
        command.body.objectives = objectives;
        return command;
    }
    async getObjectiveName(objective) {
        let displayname;
        const objectives = await this.getObjectives();
        if (objectives == undefined)
            return;
        for (const obj of objectives.body.objectives) {
            if (obj[0] == objective) {
                displayname = obj[1];
            }
        }
        return displayname;
    }
    async updateScore(target, operation, objective, amount) {
        const command = await this.bewss.getCommandManager().executeCommand(`/scoreboard players ${operation} "${target}" ${objective} ${amount}`);
        if (command.body.statusCode == -2147483648)
            return;
        return command;
    }
    async getScore(target, objective) {
        const command = await this.bewss.getCommandManager().executeCommand(`/scoreboard players list "${target}"`);
        if (command.body.statusCode == -2147483648)
            return;
        const objectiveName = await this.getObjectiveName(objective);
        let score;
        const raw = command.body.statusMessage.split('\n');
        for (const string of raw) {
            if (!string.startsWith("§a") && string.includes(objectiveName)) {
                const rawString = string.split(' ').reverse();
                score = parseInt(rawString[1]);
            }
        }
        command.body.score = score;
        command.body.objective = objective;
        command.body.objectiveName = objectiveName;
        return command;
    }
}
exports.default = scoreboardManager;
