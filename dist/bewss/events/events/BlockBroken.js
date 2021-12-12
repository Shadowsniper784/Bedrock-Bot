"use strict";
class BlockBroken {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'BlockBroken';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('BlockBroken');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'BlockBroken')
                return;
            this.bewss.getEventManager().emit('BlockBroken', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('BlockBroken');
    }
}
module.exports = BlockBroken;
