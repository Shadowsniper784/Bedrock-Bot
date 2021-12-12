"use strict";
class AgentCommand {
    constructor(bewss) {
        this.bewss = bewss;
        this.eventName = 'AgentCommand';
    }
    async onEnabled() {
        this.bewss.getEventManager().registerEvent('AgentCommand');
        this.bewss.getServerManager().getServer()
            .on('message', (packet) => {
            if (!packet.includes('header'))
                return;
            const parsedPacket = JSON.parse(packet);
            if (parsedPacket.header.messagePurpose != 'event')
                return;
            if (parsedPacket.body.eventName != 'AgentCommand')
                return;
            this.bewss.getEventManager().emit('AgentCommand', parsedPacket);
        });
    }
    async onDisabled() {
        this.bewss.getEventManager().unregisterEvent('AgentCommand');
    }
}
module.exports = AgentCommand;
