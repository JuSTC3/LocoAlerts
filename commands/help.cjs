const { SlashCommandBuilder } = require('discord.js');
const { command } = require('../config/config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName(command.help)
		.setDescription('Helps You!'),
	async execute(interaction) {
		await interaction.reply(
			{
				content: ` Hi Welcome To Help Section \n\n**Basic Commands** : - \n> \`\`/loco add-streamer\`\` \n> \`\`/loco remove-streamer\`\` \n> \`\`Need Manage Server Permission to use commands\`\`\n **\`\`\`/loco add-streamer\`\`\`**\n> Syntax : /loco add-streamer \`\`streamer-id\`\` \`\`channel\`\` \`\`role\`\` \nstreamer-id - loco stramer id, you can find the streamer-id from streamer loco profile URL\n\nexample : **loco.gg/streamers/eagle-gaming-op** - \`eagle-gaming-op\` is the streamer-id of Eagle Gaming\nexample : **loco.gg/streamers/0RZ13FVH2M** - \`0RZ13FVH2M\` is the streamer-id of MrzGoku\n\n**\`\`\`/loco remove-streamer\`\`\`**\n> Syntax : /loco add-streamer \`\`streamer-id\`\``,
				ephemeral: true
			}
		);
	},
};
