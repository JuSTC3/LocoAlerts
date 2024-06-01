const { REST, Routes } = require('discord.js');
const { clientId, token, guildId } = require('./config/config.json');
const fs = require('node:fs');

module.exports = handleCommands = async () => {
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.cjs'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );            

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
};

module.exports = handleLocalCommands = async () => {
    const localcommands = [];
    const localcommandFiles = fs.readdirSync('./commandslocal').filter(file => file.endsWith('.cjs'));

    for (const file of localcommandFiles) {
        const localcommand = require(`./commandslocal/${file}`);
        localcommands.push(localcommand.data.toJSON());
    }

    const localrest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log(`Started refreshing ${localcommands.length} application Guild (/) commands.`);

            const localdata = await localrest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: localcommands },
            );

            console.log(`Successfully reloaded ${localdata.length} application Guild (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
};