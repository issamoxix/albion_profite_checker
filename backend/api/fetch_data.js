const https = require("https");
const sdc = async (items, locations, qualities) => {
  let dataString = "";

  let url = `https://www.albion-online-data.com/api/v2/stats/prices/${items}?locations=${locations}&qualities=${qualities}`;
  const response = await new Promise((resolve, reject) => {
    const req = https.get(url, function (res) {
      res.on("data", (chunk) => {
        dataString += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
          body: JSON.stringify(JSON.parse(dataString), null, 4),
        });
      });
    });

    req.on("error", (e) => {
      reject({
        statusCode: 500,
        body: "Something went wrong!",
      });
    });
  });

  return response;
};

module.exports = sdc;
