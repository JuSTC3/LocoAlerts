const fs = require('node:fs');
const path = require('node:path');
const { CronJob } = require("cron")
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, cron } = require('./config/config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
	]
});

const deploy = require('./deploy-commands.cjs')
handleCommands()
handleLocalCommands()

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const localcommandsPath = path.join(__dirname, 'commandslocal');
const localcommandFiles = fs.readdirSync(localcommandsPath).filter(file => file.endsWith('.cjs'));

for (const file of localcommandFiles) {
	const localfilePath = path.join(localcommandsPath, file);
	const localcommand = require(localfilePath);
	if ('data' in localcommand && 'execute' in localcommand) {
		client.commands.set(localcommand.data.name, localcommand);
	} else {
		console.log(`[WARNING] The command at ${localfilePath} is missing a required "data" or "execute" property.`);
	}
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.cjs'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);


var isliveJob = new CronJob(cron.islive, async function () {
	const result = await import("./loco_/liveCheck.js").then((mod) => { var res = mod.liveCheck(client); return res; });
}, null, true, "Asia/Kolkata")


isliveJob.start();

(async function () {
	//const result = await import("./loco_/liveCheck.js").then((mod) => { var res = mod.liveCheck(); return res; });
})()