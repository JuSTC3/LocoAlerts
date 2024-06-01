import fs from "fs"
import fetch from 'node-fetch';
import { load } from 'cheerio';
import DAPI from "../common/api.js"
import DGlobal from "../config/globalConfig.js"
import config from "../config/config.json" assert { type: "json" }

export async function removeStreamer(data) {
    data = JSON.parse(data)

    const response = await fetch(config.api.streamer);
    const body = await response.text();
    const $ = load(body);
    var build = JSON.parse($('#__NEXT_DATA__').html())

    let streamer = await DAPI.ApiCall(config.api.streamer + build.buildId + '/streamers/' + data.sid + '.json?id=' + data.sid)
    if (!streamer.notFound && !streamer.error) {
        var uid = streamer.pageProps.streamerProfile.user_uid ?? null

        while (DGlobal._botdatalock) {
            console.log("waiting...removeStreamer.js")
        }
        DGlobal._botdatalock = true
        let SData = await JSON.parse(fs.readFileSync("./data/botData.json", "utf8"), null, 2);
        if (SData[uid] && SData[uid].servers[data.server]) {
            delete SData[uid].servers[data.server]
            await fs.writeFileSync("./data/botData.json", JSON.stringify(SData, null, 2))
            DGlobal._botdatalock = false
            return JSON.stringify({ 'status': true, 'msg': "Streamer Removed" })
        } else {
            DGlobal._botdatalock = false
            return JSON.stringify({ 'status': true, 'msg': "Failed" })
        }
    }
    else {
        return JSON.stringify({ 'status': false, 'msg': "Streamer Not Found" })
    }
}
