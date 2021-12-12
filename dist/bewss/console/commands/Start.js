"use strict";
class Start {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'start';
    }
    async execute() {
        this.bewss.getServerManager().onEnabled();
    }
}
module.exports = Start;
