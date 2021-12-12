"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blocks_1 = require("../../data/1.17/blocks");
class worldManager {
    constructor(bewss) {
        this.bewss = bewss;
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    async getSurfaceBlock(x, z) {
        const command = await this.bewss.getCommandManager().executeCommand(`/gettopsolidblock ${x} 255 ${z}`);
        if (command.body.statusCode == -2147483648)
            return;
        return {
            name: command.body.blockName,
            position: command.body.position,
        };
    }
    async setblock(x, y, z, block, data) {
        const command = await this.bewss.getCommandManager().executeCommand(`/setblock ${x} ${y} ${z} ${block} ${data}`);
        if (command.body.statusCode == -2147483648)
            return;
        return command;
    }
    async getBlock(x, y, z) {
        const command = await this.bewss.getCommandManager().executeCommand(`/testforblock ${x} ${y} ${z} air`);
        if (command.body.statusCode == -2147483648)
            return;
        if (command.body.matches)
            return {
                id: 0,
                displayName: 'Air',
                name: 'air',
                hardness: 0,
                resistance: 0,
                minStateId: 134,
                maxStateId: 134,
                drops: [],
                diggable: true,
                transparent: true,
                filterLight: 0,
                emitLight: 0,
                boundingBox: 'empty',
                stackSize: 0,
                defaultState: 0,
                position: {
                    x: x,
                    y: y,
                    z: z,
                },
            };
        const blockName = command.body.statusMessage.match(/(?<=is )(.*?)(?= \()/)[0];
        const block = blocks_1.blocks.find(e => e.displayName == blockName);
        block.position = command?.body?.position;
        return block;
    }
    sendMessage(message) {
        this.bewss.getCommandManager().executeCommand(`/tellraw @a {"rawtext":[{"text":"${message}"}]}`);
    }
}
exports.default = worldManager;
