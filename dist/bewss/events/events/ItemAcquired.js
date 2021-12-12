"use strict";
class ItemAcquired {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'ItemAcquired';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('ItemAcquired');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'ItemAcquired')
                return;
            this.bewss.getEventManager().emit('ItemAcquired', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('ItemAcquired');
    }
}
module.exports = ItemAcquired;
