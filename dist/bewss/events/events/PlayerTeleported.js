"use strict";
class PlayerTeleported {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'PlayerTeleported';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('PlayerTeleported');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'PlayerTeleported')
                return;
            this.bewss.getEventManager().emit('PlayerTeleported', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('PlayerTeleported');
    }
}
module.exports = PlayerTeleported;
