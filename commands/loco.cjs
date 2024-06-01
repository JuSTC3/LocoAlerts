const wait = require('node:timers/promises').setTimeout;
const fs = require('node:fs');
const { command, clientId } = require('../config/config.json');
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName(command.main)
        .setDescription('Used To Manage The Loco Live Notification!')
        .addSubcommand(subcommand =>
            subcommand
                .setName(command.add)
                .setDescription('Add A Streamer Live Notofication')
                .addStringOption(option =>
                    option.setName('streamer-id')
                        .setDescription('Loco Streamer Id')
                        .setRequired(true)
                        .setMaxLength(30))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The Channel To Update Live Notification')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Role That Want to Mention')))
        .addSubcommand(subcommand =>
            subcommand
                .setName(command.remove)
                .setDescription('Remove A Streamer Live Notification')
                .addStringOption(option =>
                    option.setName('streamer-id')
                        .setDescription('Loco Streamer Id')
                        .setRequired(true)
                        .setMaxLength(100)
                        .setAutocomplete(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const gid = interaction.guild.id
        const choices = [];
        
        let streamers = await JSON.parse(fs.readFileSync("./data/botData.json", "utf8"), null, 2);
        let sid = null
        for (key in streamers) {
            sid = (streamers[key].user_uid2) ? streamers[key].user_uid2 : streamers[key].user_uid
            for (s in streamers[key].servers) {
                if (gid === s) {
                    choices.push(`${streamers[key].username} : ${sid}`)
                }
            }
        }
        let filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
        filtered = filtered.slice(0,25);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction) {
        if(!interaction) return;
        if (interaction.options.getSubcommand() === command.add) {
            const sid = interaction.options.getString('streamer-id') ?? null;
            const cid = interaction.options.getChannel('channel') ?? null
            const rid = interaction.options.getRole('role') ?? null
            await interaction.deferReply({ ephemeral: true })
            let perm = await interaction.guild.members
                .fetch(clientId)
                .then(async (member) => {
                    if (!member.permissionsIn(cid).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks])) {
                        await interaction.editReply({ content: `Bot Have No Permission To Send Messages In ${cid} \nPlease Make Sure Bot Have Administrator Power or ViewChannel , SendMessage & EmbedLinks Permission`, ephemeral: true });
                        return true
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
            if(perm) return;
            if (sid && cid) {
                var inp = {}
                inp['sid'] = sid
                inp['server'] = interaction.guild.id
                inp['channel'] = cid.id
                inp['role'] = rid?.id ?? null
                const result = JSON.parse(await import("../loco_/addStreamer.js").then((mod) => { var res = mod.addStreamer(JSON.stringify(inp)); return res; }));
                if (result.status) {
                    await interaction.editReply({ content: result.msg, ephemeral: true });
                } else {
                    await interaction.editReply({ content: result.msg, ephemeral: true });
                }
            } else {
                await interaction.editReply({ content: `Try Again Some Parameters Not Valid`, ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === command.remove) {
            var res = interaction.options.getString('streamer-id') ?? null;
            await interaction.deferReply({ ephemeral: true })
            let sid = null
            if(res.includes(' : ')){
                res = res.split(' : ')
				sid = res[1]
            } else {
                sid = res
            }

            if (sid) {
                var inp = {}
                inp['sid'] = sid
                inp['server'] = interaction.guild.id
                const result = JSON.parse(await import("../loco_/removeStreamer.js").then((mod) => { var res = mod.removeStreamer(JSON.stringify(inp)); return res; }));
                await interaction.editReply({ content: result.msg, ephemeral: true });
            } else {
                await interaction.editReply({ content: `Try Again Some Parameters Not Valid`, ephemeral: true });
            }
        }
    },
};