"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class entityManager {
    constructor(bewss) {
        this.bewss = bewss;
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    async getEntityList() {
        const command = await this.bewss.getCommandManager().executeCommand('/testfor @e[type=!item,type=!player]');
        if (command.body.statusCode == -2147483648)
            return [''];
        return command.body.victim;
    }
    async summonEntity(entity, name, x, y, z) {
        const command = await this.bewss.getCommandManager().executeCommand(`/summon ${entity} ${name} ${x} ${y} ${z}`);
        const response = await this.bewss.getCommandManager().findResponse(command.requestId);
        return response;
    }
    async executeCommandAsEntity(name, commands) {
        const command = await this.bewss.getCommandManager().executeCommand(`/execute @e[name="${name}"] ~ ~ ~ ${commands}`);
        return command;
    }
    async removeEntity(name) {
        const command = await this.bewss.getCommandManager().executeCommand(`/kill @e[type=!player,c=1,name="${name}"]`);
        return command;
    }
    async removeEntities(entity, amount) {
        let count = 0;
        const inv = setInterval(() => {
            if (count < amount + 1) {
                this.bewss.getCommandManager().executeCommand(`/kill @e[type=!player,c=1,type=${entity}]`);
                count++;
            }
            else {
                clearInterval(inv);
            }
        }, 50);
        return;
    }
    async getTags(name) {
        const command = await this.bewss.getCommandManager().executeCommand(`/tag @e[name="${name}"] list`);
        if (command == undefined || command.body.statusCode == -2147483648)
            return;
        const raw = command.body.statusMessage.split(' ');
        const tags = [];
        for (const string of raw) {
            if (string.startsWith("§a"))
                tags.push(string.replace('§a', '').replace('§r', '')
                    .replace(',', ''));
        }
        return tags;
    }
    async hasTag(name, tag) {
        const tags = await this.getTags(name);
        if (!tags.includes(tag))
            return false;
        return true;
    }
}
exports.default = entityManager;
