"use strict";
class ItemDestroyed {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'ItemDestroyed';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('ItemDestroyed');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'ItemDestroyed')
                return;
            this.bewss.getEventManager().emit('ItemDestroyed', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('ItemDestroyed');
    }
}
module.exports = ItemDestroyed;
