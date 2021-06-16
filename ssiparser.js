/*const https = require('https');
const options = {
  hostname: 'services5.arcgis.com',
  port: 443,
  path: '/Hx7l9qUpAnKPyvNz/arcgis/rest/services/DB_kommunalt_data_gdb/FeatureServer/7/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Date%20desc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();

*/
const got = require('got');

exports.getCoronaTalData = async () => {
  try {
    const response = await got(
      'https://services5.arcgis.com/Hx7l9qUpAnKPyvNz/arcgis/rest/services/DB_kommunalt_data_gdb/FeatureServer/7/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Date%20desc&resultOffset=0&resultRecordCount=1&resultType=standard&cacheHint=true',
      {}
    );
    let parsedData = JSON.parse(response.body).features[0].attributes;
    let percentageOfPositives =
      Math.round(
        ((parseInt(parsedData.Daily_Infected) * 1.0) /
          parseInt(parsedData.Tests_Diff)) *
          10000
      ) / 100;
    var result =
      'Dagens coronatal: ' +
      parsedData.Daily_Infected +
      ' (' +
      parsedData.Daily_Dead +
      ' døde) - ' +
      parsedData.Tests_Diff +
      ' testede (' +
      percentageOfPositives +
      '%)';
    return result;
  } catch (error) {
    console.log(error);
  }
};
async function test() {
  var res = exports.getCoronaTalData();
  await res;
  console.log(res);
}
