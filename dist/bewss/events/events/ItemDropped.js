"use strict";
class ItemDropped {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'ItemDropped';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('ItemDropped');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'ItemDropped')
                return;
            this.bewss.getEventManager().emit('ItemDropped', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('ItemDropped');
    }
}
module.exports = ItemDropped;
