"use strict";
class AgentCreated {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'AgentCreated';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('AgentCreated');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'AgentCreated')
                return;
            this.bewss.getEventManager().emit('AgentCreated', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('AgentCreated');
    }
}
module.exports = AgentCreated;
