"use strict";
class MobKilled {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'MobKilled';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('MobKilled');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'MobKilled')
                return;
            this.bewss.getEventManager().emit('MobKilled', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('MobKilled');
    }
}
module.exports = MobKilled;
