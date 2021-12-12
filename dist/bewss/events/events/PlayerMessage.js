"use strict";
class PlayerMessage {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'PlayerMessage';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('PlayerMessage');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'PlayerMessage')
                return;
            this.bewss.getEventManager().emit('PlayerMessage', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('PlayerMessage');
    }
}
module.exports = PlayerMessage;
