const axios = require('axios');
var config = require("./config");
var qs = require("qs");
var fs = require('fs');


var {ENV, EMAIL_PREFIX, EMAIL_SUFFIX, DEFAULT_PASSWORD, MAX_ITERATION, TEST_CHANNEL, CHANNELS} = config;

var TTP_API_URL = config[ENV].TTP_API_URL;

const data = {
  // grant_type: "client_credentials",
  grant_type: "password",
  username:	"med.em@gmail.com",
  password:	DEFAULT_PASSWORD,
  client_id: 10004,
  client_secret: "TTPSecrectS#K$",
  scope: "ttp",
};


var i = 800;

var fileName = "tokens-" + ENV + "-" + (new Date()).getTime() + ".csv";
fs.appendFile(fileName, "id,token\n", function (err) {
  if (err) throw err;
  console.log('File created', fileName);
});
var interval = setInterval(function () {
  data.username = EMAIL_PREFIX + i + EMAIL_SUFFIX;
  axios
    .post(TTP_API_URL + "/token", qs.stringify(data))
    .then((res) => {
      var id = res.data.data.user.id;
      var token = res.data.token.access_token;
      fs.appendFile(fileName, id + "," + token + "\n", function (err) {
        if (err) console.error(i,data);
        console.log('Saved!', id + "," + token + "\n");
      });
    })
    .catch((error) => {
      console.error(error)
      debugger;
    });
  i++;
  if(i>5000) clearInterval(interval);
}, 5000);
