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
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlX2pvaW5lZCI6MCwiZGV2aWNlX2lkIjoiY2Y3MTY3NTc0MjJjOTQxODZkMWVlZWI1MzllMmMxNzlsaXZlIiwiZXhwIjoxNzI0ODM1MDE1LCJpYXQiOjE3MTcwNTkwMTUsImlwX2FkZHIiOiIxMDYuMjIyLjIzOS4xODAiLCJpc19ndWVzdCI6dHJ1ZSwiaXNvX2NvZGUiOiJJTiIsImlzcyI6IkxvY28uZ2ciLCJzY29wZSI6ImFsbCJ9.K_nV_oP1jl3ZEiJBnqr_PO0hMnV7HcCCGpGSA18JrsU",
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
}

export default new DAPI();
