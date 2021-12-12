"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class agentManager {
    constructor(bewss) {
        this.bewss = bewss;
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    async create() {
        const command = await this.bewss.getCommandManager().executeCommand('/agent create');
        return command;
    }
    async getPosition() {
        const command = await this.bewss.getCommandManager().executeCommand('/agent getposition');
        return command;
    }
    async teleport(x, y, z) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent tp ${x} ${y} ${z}`);
        return command;
    }
    async inspect(direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent inspect ${direction}`);
        return command;
    }
    async inspectData(direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent inspectdata ${direction}`);
        return command;
    }
    async setItem(slot, item, amount, data) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent setitem ${slot} ${item} ${amount} ${data}`);
        return command;
    }
    async getItem(slot) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent getitemdetail ${slot}`);
        return command;
    }
    async getItemCount(slot) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent getitemcount ${slot}`);
        return command;
    }
    async transferItem(slot, amount, destslot) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent transfer ${slot} ${amount} ${destslot}`);
        return command;
    }
    async dropItem(slot, amount, direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent drop ${slot} ${amount} ${direction}`);
        return command;
    }
    async turn(direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent turn ${direction}`);
        return command;
    }
    async move(direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent move ${direction}`);
        return command;
    }
    async attack(direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent attack ${direction}`);
        return command;
    }
    async place(slot, direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent place ${slot} ${direction}`);
        return command;
    }
    async destroy(direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent destroy ${direction}`);
        return command;
    }
    async collect(item) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent collect ${item}`);
        return command;
    }
    async till(direction) {
        const command = await this.bewss.getCommandManager().executeCommand(`/agent till ${direction}`);
        return command;
    }
}
exports.default = agentManager;
