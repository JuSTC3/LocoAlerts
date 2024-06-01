import { CronJob } from "cron"
import fs from "fs"
import DGlobal from "../config/globalConfig.js"
import DAPI from "../common/api.js"
import config from "../config/config.json" assert { type: "json" }

export function locoStreamers() {
    job.start()
}

var job = new CronJob(config.cron.streamerList, async function () {
    getLocoStreamers()
}, null, true, "Asia/Kolkata")

async function getLocoStreamers() {
    let streamers = await DAPI.ApiCall(config.api.streamers_url)
    streamers = streamers.results
    var streamers_data = {}
    for (var i in streamers) {
        var sid = streamers[i].content[0].component.analytics.streamer_id
        streamers_data[sid] = streamers[i].content[0].component.analytics.streamer_name
    }
    DGlobal._locoStreamerslock = true
    await fs.writeFileSync("./data/locoStreamers.json", JSON.stringify(streamers_data, null, 2))
    DGlobal._locoStreamerslock = false
    console.log("\x1b[34m","streamers data updated", new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta", }),'\x1b[0m')
}




locoStreamers()
