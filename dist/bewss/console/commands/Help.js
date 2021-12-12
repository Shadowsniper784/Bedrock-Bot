"use strict";
class Help {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'help';
    }
    async execute() {
        this.bewss.getLogger().info('Node BeWSS by PMK744\nHere is a list of commands:');
        for (const command of this.bewss.getConsoleManager().getCommandNames()) {
            console.log(` -${command}`);
        }
    }
}
module.exports = Help;
