import bewss from "src/bewss/bewss"

class Quit {
  private bewss: bewss
  public commandName: string

  constructor(bewss: bewss) {
    this.bewss = bewss
    this.commandName = 'quit'
  }

  async execute(): Promise<void> {
    this.bewss.onDisabled()
  }

}

export = Quit
