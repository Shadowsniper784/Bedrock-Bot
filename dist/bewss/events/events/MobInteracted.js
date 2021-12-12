"use strict";
class MobInteracted {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'MobInteracted';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('MobInteracted');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'MobInteracted')
                return;
            this.bewss.getEventManager().emit('MobInteracted', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('MobInteracted');
    }
}
module.exports = MobInteracted;
