"use strict";
class ItemUsed {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'ItemUsed';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('ItemUsed');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'ItemUsed')
                return;
            this.bewss.getEventManager().emit('ItemUsed', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('ItemUsed');
    }
}
module.exports = ItemUsed;
