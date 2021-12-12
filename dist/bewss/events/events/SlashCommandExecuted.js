"use strict";
class SlashCommandExecuted {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'SlashCommandExecuted';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('SlashCommandExecuted');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.requestId == '00000000-0000-0000-0000-000000000000') {
                this.bewss.getEventManager().emit('SlashCommandExecuted', parsedPacket);
            }
            else {
                this.bewss.getEventManager().emit('SlashCommandExecutedConsole', parsedPacket);
            }
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('SlashCommandExecuted');
    }
}
module.exports = SlashCommandExecuted;
