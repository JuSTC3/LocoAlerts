import { CronJob } from "cron"
import fs from "fs"
import DGlobal from "../config/globalConfig.js"
import DAPI from "../common/api.js"
import config from "../config/config.json" assert { type: "json" }

export function locoLive() {
    job.start()
}

var job = new CronJob(config.cron.liveList, async function () {
    getlocoLive()
}, null, true, "Asia/Kolkata")

async function getlocoLive() {
    let live = await DAPI.ApiCall(config.api.live_url)
    live = live.results
    var live_data = {}
    for (var i in live) {
        var sid = live[i].content[0].component.data.streamer_uid.data
        var ldata = {}
        ldata["streamer_id"] = sid
        ldata["streamer_name"] = live[i].content[0].component.data.streamer_name.data
        ldata["streamer_url"] = live[i].content[0].component.data.streamer_image.data
        ldata["verified"] = live[i].content[0].component.data.verified_streamer
        ldata["is_live"] = live[i].content[0].component.data.is_live

        ldata["stream_uid"] = live[i].content[0].component.data.stream_uid.data
        ldata["thumbnail"] = live[i].content[0].component.data.thumbnail.data
        ldata["stream_title"] = live[i].content[0].component.data.stream_title.data
        ldata["stream_tags"] = live[i].content[0].component.data.stream_tags[0]?.data ?? 'others'
        ldata["view_count"] = live[i].content[0].component.data.view_count?.data ?? 'Just Started Now'

        live_data[sid] = ldata
    }
    while (DGlobal._locoLivelock) {
        console.log("waiting...locoLive.js")
    }
    DGlobal._locoLivelock = true
    await fs.writeFileSync("./data/locoLive.json", JSON.stringify(live_data, null, 2))
    DGlobal._locoLivelock = false
    console.log("\x1b[34m", "Live data updated", new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta", }), '\x1b[0m')
}



locoLive()
