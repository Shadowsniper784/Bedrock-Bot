import { pluginApi } from './@interface/bewss.i'
import { Client, TextChannel } from 'discord.js'
import fs from 'fs'
import path from 'path'

class examplePlugin {
    private api: pluginApi
    private config: { token: string, channelID: string } = JSON.parse(fs.readFileSync(path.resolve(process.cwd() + '/plugins/discordBridge/config.json')).toString('utf-8'))
    private client: Client = new Client()

    constructor(api: pluginApi) {
        this.api = api
        this.api.setColor('cyan')
        this.client.login(process.env.DISCORD_TOKEN)
    }

    async onEnabled() {
        this.api.getLogger().info('Plugin enabled!')
        this.client.once('ready', () => {
            this.api.getLogger().info(`${this.client.user.tag} is online!`)
        })
        this.client.on('message', (data) => {
            if (data.channel.id != this.config.channelID || data.author.bot) return
            this.api.getWorldManager().sendMessage(`§l§8[§r§9Discord§l§8]§r §7${data.author.username}#${data.author.discriminator}:§r ${data.content}`)
        })
        this.api.getEventManager().on('PlayerMessage', (packet) => {
            if (packet.body.properties.Sender == "External") return
            this.client.channels.fetch(this.config.channelID).then((channel: TextChannel) => channel.send(`**${packet.body.properties.Sender}:** ${packet.body.properties.Message}`))
        })
    }

    async onDisabled() {
        this.api.getLogger().success('Plugin disabled!')
        this.client.destroy()
    }
}

export = examplePlugin
