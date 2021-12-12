"use strict";
class ItemCrafted {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'ItemCrafted';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('ItemCrafted');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'ItemCrafted')
                return;
            this.bewss.getEventManager().emit('ItemCrafted', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('ItemCrafted');
    }
}
module.exports = ItemCrafted;
