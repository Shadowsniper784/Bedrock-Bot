"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class playerManager {
    constructor(bewss) {
        this.bewss = bewss;
    }
    async onEnabled() {
        this.bewss.getServerManager().on('wssconnected', async () => {
            const command = await this.bewss.getCommandManager().executeCommand('/getlocalplayername');
            if (command.body.statusCode == -2147483648)
                return;
            this.localePlayerName = command.body.localplayername;
        });
    }
    async onDisabled() {
        this.localePlayerName = "";
        return;
    }
    getLocalPlayerName() {
        return this.localePlayerName;
    }
    async getPlayerList() {
        const command = await this.bewss.getCommandManager().executeCommand('/list');
        if (command.body.players == undefined || command.body.statusCode == -2147483648)
            return;
        const playersString = command.body.players;
        return playersString.split(', ');
    }
    sendMessage(type, target, content) {
        if (type == "text") {
            if (target == "@s")
                target = this.localePlayerName;
            if (/^@s$|^@a$|^@p$|^@r$|^@e$/.test(target)) {
                this.bewss.getCommandManager().executeCommand(`/tellraw ${target} {"rawtext":[{"text":"${content}"}]}`);
            }
            else {
                this.bewss.getCommandManager().executeCommand(`/tellraw "${target}" {"rawtext":[{"text":"${content}"}]}`);
            }
        }
        if (type == "json") {
            if (target == "@s")
                target = this.localePlayerName;
            if (/^@s$|^@a$|^@p$|^@r$|^@e$/.test(target)) {
                this.bewss.getCommandManager().executeCommand(`/tellraw ${target} {"rawtext":${JSON.stringify(content)}}`);
            }
            else {
                this.bewss.getCommandManager().executeCommand(`/tellraw "${target}" {"rawtext":${JSON.stringify(content)}}`);
            }
        }
    }
    sendTitle(type, target, content, title) {
        if (type == "text") {
            if (target == "@s")
                target = this.localePlayerName;
            if (/^@s$|^@a$|^@p$|^@r$|^@e$/.test(target)) {
                this.bewss.getCommandManager().executeCommand(`/titleraw ${target} ${title} {"rawtext":[{"text":"${content}"}]}`);
            }
            else {
                this.bewss.getCommandManager().executeCommand(`/titleraw "${target}" ${title} {"rawtext":[{"text":"${content}"}]}`);
            }
        }
        if (type == "json") {
            if (target == "@s")
                target = this.localePlayerName;
            if (/^@s$|^@a$|^@p$|^@r$|^@e$/.test(target)) {
                this.bewss.getCommandManager().executeCommand(`/titleraw ${target} ${title} {"rawtext":${JSON.stringify(content)}}`);
            }
            else {
                this.bewss.getCommandManager().executeCommand(`/titleraw "${target}" ${title} {"rawtext":${JSON.stringify(content)}}`);
            }
        }
    }
    async getPlayerPosition(target) {
        const command = await this.bewss.getCommandManager().executeCommand(`/querytarget "${target}"`);
        if (command == undefined || command.body.statusCode == -2147483648)
            return;
        return JSON.parse(command.body.details)[0];
    }
    async getPlayerPositionRealms(target) {
        return new Promise((res) => {
            this.bewss.getCommandManager().executeCommand(`/execute "${target}" ~ ~ ~ tp ~ ~ ~`);
            this.bewss.getEventManager().on('PlayerTransform', (packet) => {
                return res({
                    x: packet.body.properties.PosX,
                    y: packet.body.properties.PosY,
                    z: packet.body.properties.PosZ,
                });
            });
        });
    }
    async inPosition(target, startX, startY, startZ, directionX, directionY, directionZ) {
        const command = await this.bewss.getCommandManager().executeCommand(`/execute @a[name="${target}",x=${startX},y=${startY},z=${startZ},dx=${directionX},dy=${directionY},dz=${directionZ}] ~ ~ ~ testfor @s`);
        if (command.body.statusCode == -2147352576)
            return false;
        return true;
    }
    async getTags(target) {
        const command = await this.bewss.getCommandManager().executeCommand(`/tag "${target}" list`);
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
    async hasTag(target, tag) {
        const tags = await this.getTags(target);
        if (!tags.includes(tag))
            return false;
        return true;
    }
    async addTag(target, tag) {
        const command = await this.bewss.getCommandManager().executeCommand(`/tag "${target}" add "${tag}"`);
        return command;
    }
    async removeTag(target, tag) {
        const command = await this.bewss.getCommandManager().executeCommand(`/tag "${target}" remove "${tag}"`);
        return command;
    }
    async kick(target, reason) {
        const command = await this.bewss.getCommandManager().executeCommand(`/kick "${target}" ${reason}`);
        return command;
    }
    async teleport(target, x, y, z) {
        const command = await this.bewss.getCommandManager().executeCommand(`/tp "${target}" ${x} ${y} ${z}`);
        return command;
    }
    async give(target, item, amount, data) {
        const command = await this.bewss.getCommandManager().executeCommand(`/give "${target}" ${item} ${amount} ${data}`);
        return command;
    }
    async replaceItem(target, container, slot, item, amount, data) {
        const command = await this.bewss.getCommandManager().executeCommand(`/replaceitem entity "${target}" ${container} ${slot} ${item} ${amount} ${data}`);
        return command;
    }
    async updateGamemode(target, gamemode) {
        const command = await this.bewss.getCommandManager().executeCommand(`/gamemode ${gamemode} "${target}"`);
        return command;
    }
    async updateAbility(target, ability, enabled) {
        const command = await this.bewss.getCommandManager().executeCommand(`/ability "${target}" ${ability} ${enabled}`);
        return command;
    }
    async getXpLevel(target) {
        const command = await this.bewss.getCommandManager().executeCommand(`/xp 0 "${target}"`);
        return command.body.level;
    }
    async addXp(target, amount) {
        const command = await this.bewss.getCommandManager().executeCommand(`/xp ${amount} "${target}"`);
        return command;
    }
    async addXpLevel(target, amount) {
        const command = await this.bewss.getCommandManager().executeCommand(`/xp ${amount}l "${target}"`);
        return command;
    }
    async removeXp(target, amount) {
        const command = await this.bewss.getCommandManager().executeCommand(`/xp -${amount} "${target}"`);
        return command;
    }
    async removeXpLevel(target, amount) {
        const command = await this.bewss.getCommandManager().executeCommand(`/xp -${amount}l "${target}"`);
        return command;
    }
    async getItemCount(target, item) {
        const command = await this.bewss.getCommandManager().executeCommand(`/clear "${target}" ${item} 0 0`);
        if (command.body.statusMessage.includes('no items to remove'))
            return 0;
        return parseInt(command.body.statusMessage.replace(`${target} has `, '').replace(' items that match the criteria', ''));
    }
}
exports.default = playerManager;
