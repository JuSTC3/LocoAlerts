import fetch from 'node-fetch';
class DAPI {
  constructor() { }
  async ApiCall(url) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        Authorization: global.authToken,
        "X-PLATFORM": "7",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
      credentials: "include",
      referrer: "https://loco.gg/",
      method: "GET",
      mode: "cors",
    });
    try {
      //console.log(response);
      const myJson = await response.json().then()
      return myJson;
    } catch (err) {
      console.error("\x1b[31m", err, "\x1b[0m")
      return { "error": true }
    }
  }
  async getAuthToken(url) {
    const options = {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-GB,en;q=0.9',
        'device-id': 'cf716757422c94186d1eeeb539e2c179live',
        'x-client-id': 'TlwKp1zmF6eKFpcisn3FyR18WkhcPkZtzwPVEEC3',
        'x-client-secret': 'Kp7tYlUN7LXvtcSpwYvIitgYcLparbtsQSe5AdyyCdiEJBP53Vt9J8eB4AsLdChIpcO2BM19RA3HsGtqDJFjWmwoonvMSG3ZQmnS8x1YIM8yl82xMXZGbE3NKiqmgBVU',
        'x-platform': '7',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "platform": 7,
        "client_id": "",
        "client_secret": "",
        "model": "",
        "os_ver": "",
        "os_name": "",
        "app_ver": ""
      })
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Fetching Access Token ...");
      return data.access_token;
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export default new DAPI();
