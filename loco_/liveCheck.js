import fs from "fs"
import DGlobal from "../config/globalConfig.js"
import config from "../config/config.json" assert { type: "json" }
import { sendNotification } from "./sendNotification.js"

export async function liveCheck(client) {

    while (DGlobal._locoLivelock) {
        console.log("waiting...liveCheck.js-1")
    }
    DGlobal._locoLivelock = 1
    let locoLive = await JSON.parse(fs.readFileSync("./data/locoLive.json", "utf8"), null, 2);
    DGlobal._locoLivelock = 0

    while (DGlobal._botdatalock) {
        console.log("waiting...liveCheck.js-2")
    }
    DGlobal._botdatalock = true
    let streamers = await JSON.parse(fs.readFileSync("./data/botData.json", "utf8"), null, 2);
    var date = new Date()
    var flag = false
    for (const [key, value] of Object.entries(streamers)) {
        if (locoLive[key] && locoLive[key].is_live) {
            if (!streamers[key].is_live && (date.getTime() - streamers[key].lasttime > config.DeLay)) {
                streamers[key].is_live = true
                streamers[key].lasttime = date.getTime()
                flag = true
                sendNotification(streamers[key], locoLive[key], client)
                //(streamers[key].username, " streamer is live") // call discord noti
            }
        } else if(locoLive) {
            if (streamers[key].is_live) {
                streamers[key].is_live = false
                streamers[key].lasttime = date.getTime()
                flag = true
            }
        }
    }
    if (flag) {
        await fs.writeFileSync("./data/botData.json", JSON.stringify(streamers, null, 2))
    }
    DGlobal._botdatalock = false
    console.log("\x1b[32m", "isLive Check", new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta", }), '\x1b[0m')
}


