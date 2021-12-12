"use strict";
class Reindex {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'reindex';
    }
    async execute() {
        await this.bewss.getPluginManager().reIndex();
        this.bewss.getLogger().success('Reindexed plugin folder.');
    }
}
module.exports = Reindex;
