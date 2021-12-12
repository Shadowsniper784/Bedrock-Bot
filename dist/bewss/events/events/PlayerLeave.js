"use strict";
class PlayerLeave {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'PlayerLeave';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('PlayerLeave');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'PlayerLeave')
                return;
            this.bewss.getEventManager().emit('PlayerLeave', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('PlayerLeave');
    }
}
module.exports = PlayerLeave;
