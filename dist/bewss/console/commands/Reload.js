"use strict";
class Reload {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'reload';
    }
    async execute() {
        await this.bewss.getPluginManager().reloadAll();
        this.bewss.getLogger().success('All plugins reloaded.');
    }
}
module.exports = Reload;
