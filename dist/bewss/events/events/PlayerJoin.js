"use strict";
class PlayerJoin {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'PlayerJoin';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('PlayerJoin');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'PlayerJoin')
                return;
            this.bewss.getEventManager().emit('PlayerJoin', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('PlayerJoin');
    }
}
module.exports = PlayerJoin;
