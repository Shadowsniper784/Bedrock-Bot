"use strict";
class Restart {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'restart';
    }
    async execute() {
        this.bewss.getServerManager().onDisabled();
        setTimeout(() => {
            this.bewss.getServerManager().onEnabled();
        }, 1000);
    }
}
module.exports = Restart;
