"use strict";
class BlockPlaced {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'BlockPlaced';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('BlockPlaced');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'BlockPlaced')
                return;
            this.bewss.getEventManager().emit('BlockPlaced', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('BlockPlaced');
    }
}
module.exports = BlockPlaced;
