"use strict";
class PlayerDied {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'PlayerDied';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('PlayerDied');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'PlayerDied')
                return;
            this.bewss.getEventManager().emit('PlayerDied', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('PlayerDied');
    }
}
module.exports = PlayerDied;
