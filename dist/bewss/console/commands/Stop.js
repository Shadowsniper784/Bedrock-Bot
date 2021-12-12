"use strict";
class Stop {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'stop';
    }
    async execute() {
        this.bewss.getServerManager().onDisabled();
    }
}
module.exports = Stop;
