"use strict";
class PlayerTransform {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'PlayerTransform';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('PlayerTransform');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'PlayerTransform')
                return;
            this.bewss.getEventManager().emit('PlayerTransform', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('PlayerTransform');
    }
}
module.exports = PlayerTransform;
