"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const uuid_1 = require("uuid");
const index_1 = require("./events/index");
class eventManager extends events_1.EventEmitter {
    constructor(bewss) {
        super();
        this.events = new Map();
        this.bewss = bewss;
    }
    async onEnabled() {
        this.bewss.getServerManager().on('wssconnected', async () => {
            this.setMaxListeners(100);
            await this.loadDefaultEvents();
            for (const event of this.events.values()) {
                event.onEnabled();
            }
        });
    }
    async onDisabled() {
        for (const event of this.events.values()) {
            event.onDisabled();
        }
        return;
    }
    async registerEvent(event) {
        this.bewss.getServerManager().getServer()
            .send(JSON.stringify({
            "body": {
                "eventName": event,
            },
            "header": {
                "requestId": uuid_1.v4(),
                "messagePurpose": 'subscribe',
                "version": 1,
            },
        }));
    }
    async unregisterEvent(event) {
        this.bewss.getServerManager().getServer()
            .send(JSON.stringify({
            "body": {
                "eventName": event,
            },
            "header": {
                "requestId": uuid_1.v4(),
                "messagePurpose": 'unsubscribe',
                "version": 1,
            },
        }));
    }
    async loadDefaultEvents() {
        const agentCommand = new index_1.AgentCommand(this.bewss);
        this.events.set(agentCommand.eventName, agentCommand);
        const agentCreated = new index_1.AgentCreated(this.bewss);
        this.events.set(agentCreated.eventName, agentCreated);
        const blockBroken = new index_1.BlockBroken(this.bewss);
        this.events.set(blockBroken.eventName, blockBroken);
        const blockPlaced = new index_1.BlockPlaced(this.bewss);
        this.events.set(blockPlaced.eventName, blockPlaced);
        const bossKilled = new index_1.BossKilled(this.bewss);
        this.events.set(bossKilled.eventName, bossKilled);
        const entitySpawned = new index_1.EntitySpawned(this.bewss);
        this.events.set(entitySpawned.eventName, entitySpawned);
        const itemAcquired = new index_1.ItemAcquired(this.bewss);
        this.events.set(itemAcquired.eventName, itemAcquired);
        const itemCrafted = new index_1.ItemCrafted(this.bewss);
        this.events.set(itemCrafted.eventName, itemCrafted);
        const itemDestroyed = new index_1.ItemDestroyed(this.bewss);
        this.events.set(itemDestroyed.eventName, itemDestroyed);
        const itemDropped = new index_1.ItemDropped(this.bewss);
        this.events.set(itemDropped.eventName, itemDropped);
        const itemUsed = new index_1.ItemUsed(this.bewss);
        this.events.set(itemUsed.eventName, itemUsed);
        const mobInteracted = new index_1.MobInteracted(this.bewss);
        this.events.set(mobInteracted.eventName, mobInteracted);
        const mobKilled = new index_1.MobKilled(this.bewss);
        this.events.set(mobKilled.eventName, mobKilled);
        const playerDied = new index_1.PlayerDied(this.bewss);
        this.events.set(playerDied.eventName, playerDied);
        const playerJoin = new index_1.PlayerJoin(this.bewss);
        this.events.set(playerJoin.eventName, playerJoin);
        const playerLeave = new index_1.PlayerLeave(this.bewss);
        this.events.set(playerLeave.eventName, playerLeave);
        const playerMessage = new index_1.PlayerMessage(this.bewss);
        this.events.set(playerMessage.eventName, playerMessage);
        const playerTeleported = new index_1.PlayerTeleported(this.bewss);
        this.events.set(playerTeleported.eventName, playerTeleported);
        const playerTransform = new index_1.PlayerTransform(this.bewss);
        this.events.set(playerTransform.eventName, playerTransform);
        const playerTravelled = new index_1.PlayerTravelled(this.bewss);
        this.events.set(playerTravelled.eventName, playerTravelled);
        const rawEvent = new index_1.RawEvent(this.bewss);
        this.events.set(rawEvent.eventName, rawEvent);
        const slashCommandExecuted = new index_1.SlashCommandExecuted(this.bewss);
        this.events.set(slashCommandExecuted.eventName, slashCommandExecuted);
    }
}
exports.default = eventManager;
