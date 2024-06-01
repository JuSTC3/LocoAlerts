const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { command } = require('../config/config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName(command.status)
		.setDescription('Check The Bot Status!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
	async execute(interaction) {
		await interaction.reply({content : `Total Servers - ${interaction.client.guilds.cache.size}`,ephemeral: true});
	},
};
