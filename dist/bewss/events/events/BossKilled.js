"use strict";
class BossKilled {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'BossKilled';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('BossKilled');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'BossKilled')
                return;
            this.bewss.getEventManager().emit('BossKilled', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('BossKilled');
    }
}
module.exports = BossKilled;
