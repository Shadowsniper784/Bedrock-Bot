"use strict";
class Help {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'help';
    }
    async execute(sender) {
        const commands = this.bewss.getCommandManager().getCommandNames();
        this.bewss.getPlayerManager().sendMessage('text', sender, `§dBeWss§r §7- §aFound ${commands.length} commands!`);
        commands.forEach((command) => {
            this.bewss.getPlayerManager().sendMessage('text', sender, `   §7-${command}`);
        });
    }
}
module.exports = Help;
