import fs from "fs"
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import DAPI from "../common/api.js"
import DGlobal from "../config/globalConfig.js"
import config from "../config/config.json" assert { type: "json" }

const permissions = new PermissionsBitField([
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
]);


export async function sendNotification(sdata, livedata, client) {
    var sid = sdata.user_uid
    var sid2 = sid
    if (sdata.user_uid2) {
        sid2 = sdata.user_uid2
    }

    const response = await fetch(config.api.streamer);
    const body = await response.text();
    const $ = load(body);
    var build = JSON.parse($('#__NEXT_DATA__').html())

    let streamer = await DAPI.ApiCall(config.api.streamer + build.buildId + '/streamers/' + sid2 + '.json?id=' + sid2)

    while (DGlobal._botdatalock) {
        console.log("waiting...sendNotification.js-1")
    }
    DGlobal._botdatalock = true
    let streamers = await JSON.parse(fs.readFileSync("./data/botData.json", "utf8"), null, 2);
    
    if(streamer && streamer.pageProps.streamerProfile){
        if(sdata.streams_count){
            console.log(streamer)
            if(sdata.streams_count == streamer.pageProps.streamerProfile.streams_count){
                DGlobal._botdatalock = false
                return;
            }else {
                streamers[sid].streams_count=streamer.pageProps.streamerProfile.streams_count
            }
        }else{
            streamers[sid].streams_count=streamer.pageProps.streamerProfile.streams_count
        }

    await fs.writeFileSync("./data/botData.json", JSON.stringify(streamers, null, 2))
    DGlobal._botdatalock = false

    sdata.servers['1040958687310782484'] = {channel: '1052666852146434058', role: null}
    for (const key in sdata.servers) {
        sendDiscord(sid2, streamer, livedata, key, sdata.servers[key].channel, sdata.servers[key].role, client)
    }
}
DGlobal._botdatalock = false


    //console.log(streamer)
}



async function sendDiscord(sid, streamer, livedata, guildId, channelId, roleId, client) {
    let guild = client.guilds.cache.get(guildId) ?? null
    let flag = false
    if (guild) {
        let channel = guild.channels.cache.get(channelId) ?? null
        if (channel) {
            flag = true
            let bot = await guild.members
                .fetch(config.clientId)
                .then((member) => {
                    return member
                })
                .catch((error) => {
                    console.log(error)
                })
            if (bot.permissionsIn(channel).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks])) {
                
                const role = guild.roles.cache.find((r) => r.id === roleId);
                var cnt = (role) ? `Hey, ${role} ${livedata.streamer_name} is now live on LOCO! 🥳🥳` : `Hey, ${livedata.streamer_name} is now live on LOCO! 🥳🥳`
                const NotifyEmbed = new EmbedBuilder()
                    .setColor(3092790)
                    .setAuthor({ name: livedata.streamer_name, iconURL: bot.displayAvatarURL({ size: 512, dynamic: true }), url: `https://loco.gg/streamers/${sid}` })
                    .setTitle(livedata.stream_title)
                    .setURL(`https://loco.gg/stream/${livedata.stream_uid}`)//loco live url
                    .setDescription(`${streamer.pageProps.streamerProfile.full_name} is now live on LOCO!`)
                    .setThumbnail(livedata.streamer_url)
                    .addFields(
                        { name: 'Bio', value: `${streamer.pageProps.streamerProfile.bio}` },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Followers', value: `${streamer.pageProps.streamerProfile.followers_count}`, inline: true },
                        { name: 'Views', value: `${streamer.pageProps.streamerProfile.views_count}`, inline: true },
                        { name: 'Streams', value: `${streamer.pageProps.streamerProfile.streams_count}`, inline: true },
                    )
                    .setImage(livedata.thumbnail)
                    .setFooter({ text: bot.user.username, iconURL: bot.displayAvatarURL({ size: 512, dynamic: true }) });

                channel.send({ content: cnt, embeds: [NotifyEmbed] })
                    .then((msg) => { })
                    .catch((err) => { console.log(err) })
            }
        }
    }
    if (!flag) {
        // while (DGlobal._botdatalock) {
        //     console.log("waiting...sendNotification.js-2")
        // }
        DGlobal._botdatalock = true
        let streamers = await JSON.parse(fs.readFileSync("./data/botData.json", "utf8"), null, 2);
        delete streamers[livedata.streamer_id].servers[guildId]
        await fs.writeFileSync("./data/botData.json", JSON.stringify(streamers, null, 2))
        DGlobal._botdatalock = false
    }

    //channel.send({ embeds: [NotifyEmbed] })
    //.then((msg)=>{})
    //.catch((err)=>{console.log(err)})

    //const botPermissionsFor = client.user.permissions.serialize()
    //const botPermissionsIn = guild.members.me.permissionsIn(channel);
    //console.log(client)

}