import fs from "fs"
import fetch from 'node-fetch';
import { load } from 'cheerio';
import DAPI from "../common/api.js"
import DGlobal from "../config/globalConfig.js"
import config from "../config/config.json" assert { type: "json" }

export async function addStreamer(data) {
    data = JSON.parse(data)

    const response = await fetch(config.api.streamer);
    const body = await response.text();
    const $ = load(body);
    var build = JSON.parse($('#__NEXT_DATA__').html())

    let streamer = await DAPI.ApiCall(config.api.streamer + build.buildId + '/streamers/' + data.sid + '.json?id=' + data.sid)
    if (!streamer.notFound && !streamer.error) {
        var uid = streamer.pageProps.streamerProfile.user_uid ?? null
        var uid2 = null
        if (uid !== data.sid) {
            uid2 = data.sid
        }

        while (DGlobal._botdatalock) {
            console.log("waiting...addStreamer.js")
        }
        DGlobal._botdatalock = true
        let SData = await JSON.parse(fs.readFileSync("./data/botData.json", "utf8"), null, 2);

        if (SData[uid]) {
            var servers = {}
            var serverid = data.server
            var userdata = SData[uid]
            userdata['user_uid2'] = uid2
            userdata['username'] = streamer.pageProps.streamerProfile.username ?? 0
            userdata['bio'] = streamer.pageProps.streamerProfile.bio ?? 0
            userdata['avatar_url'] = streamer.pageProps.streamerProfile.avatar_url ?? 0
            userdata['full_name'] = streamer.pageProps.streamerProfile.full_name ?? 0
            userdata['dob'] = streamer.pageProps.streamerProfile.dob ?? 0
            userdata['verified'] = streamer.pageProps.streamerProfile.is_loco_verified ?? 0
            
            servers.channel = data.channel
            servers.role = data.role

            userdata['servers'][serverid] = servers

            SData[uid] = userdata

            await fs.writeFileSync("./data/botData.json", JSON.stringify(SData, null, 2))
            DGlobal._botdatalock = false

            return JSON.stringify({ 'status': true, 'msg': `Streamer Live Notification Added - Streamer Name : ${userdata['username']}` })
        }
        else {
            var userdata = {}
            var servers = {}
            userdata['user_uid'] = uid
            userdata['user_uid2'] = uid2
            userdata['is_live'] = false
            userdata['username'] = streamer.pageProps.streamerProfile.username ?? 0
            userdata['bio'] = streamer.pageProps.streamerProfile.bio ?? 0
            userdata['avatar_url'] = streamer.pageProps.streamerProfile.avatar_url ?? 0
            userdata['full_name'] = streamer.pageProps.streamerProfile.full_name ?? 0
            userdata['dob'] = streamer.pageProps.streamerProfile.dob ?? 0
            userdata['verified'] = streamer.pageProps.streamerProfile.is_loco_verified ?? 0
            userdata['lasttime'] = null
            servers[data.server] = {}

            servers[data.server].channel= data.channel
            servers[data.server].role= data.role

            userdata['servers'] = servers
            SData[uid] = userdata


            await fs.writeFileSync("./data/botData.json", JSON.stringify(SData, null, 2))
            DGlobal._botdatalock = false

            return JSON.stringify({ 'status': true, 'msg': `Streamer Live Notification Added - Streamer Name : ${userdata['username']}` })
        }
    }
    else {
        return JSON.stringify({ 'status': false, 'msg': "Streamer Not Found" })
    }
}
