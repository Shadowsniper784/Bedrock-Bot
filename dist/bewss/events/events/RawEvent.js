"use strict";
class RawEvent {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'RawEvent';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('RawEvent');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            this.bewss.getEventManager().emit('RawEvent', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('RawEvent');
    }
}
module.exports = RawEvent;
