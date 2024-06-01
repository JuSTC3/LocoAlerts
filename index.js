import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { api } = require('./config/config.json');
import DAPI from "./common/api.js"

//import { locoStreamers } from "./loco/locoStreamers.js";
import { locoLive } from "./loco/locoLive.js";

const discord = require('./discord.cjs')


_init();


async function _init() {
    let token = await DAPI.getAuthToken(api.profile);
    global.authToken = token;
}
