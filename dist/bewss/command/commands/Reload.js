"use strict";
class Reload {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'reload';
    }
    async execute(sender) {
        if (sender != this.bewss.getPlayerManager().getLocalPlayerName())
            return this.bewss.getPlayerManager().sendMessage('text', sender, "§dBeWss§r §7§l>§r §cYou don't have permission to use this command!");
        await this.bewss.getPluginManager().reloadAll();
        this.bewss.getPlayerManager().sendMessage('text', sender, "§dBeWss§r §7§l>§r §aPlugin folder reloaded! Check terminal for more details.");
    }
}
module.exports = Reload;
