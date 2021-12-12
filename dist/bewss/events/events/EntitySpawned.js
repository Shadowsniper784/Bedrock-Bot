"use strict";
class EntitySpawned {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'EntitySpawned';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('EntitySpawned');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'EntitySpawned')
                return;
            this.bewss.getEventManager().emit('EntitySpawned', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('EntitySpawned');
    }
}
module.exports = EntitySpawned;
