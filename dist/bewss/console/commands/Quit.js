"use strict";
class Quit {
    constructor(bewss) {
        this.bewss = bewss;
        this.commandName = 'quit';
    }
    async execute() {
        this.bewss.onDisabled();
    }
}
module.exports = Quit;
