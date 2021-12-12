"use strict";
class PlayerTravelled {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'PlayerTravelled';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('PlayerTravelled');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'PlayerTravelled')
                return;
            this.bewss.getEventManager().emit('PlayerTravelled', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('PlayerTravelled');
    }
}
module.exports = PlayerTravelled;
