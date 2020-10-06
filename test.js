var config = require("./config");
var redline = require('redline13-webdriver');
var utils = require('./utils');
var yargs = require('yargs');
var LoremIpsum = require("lorem-ipsum").LoremIpsum;

var {TOKEN, ENV, USER_ID, MAX_ITERATION, TEST_CHANNEL} = config;

var lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 1
  },
  wordsPerSentence: {
    max: 10,
    min: 4
  }
});

const argv = yargs
  .option('token', {
    alias: 't',
    description: 'Auth token',
    type: 'string',
  })
  .option('uid', {
    alias: 'i',
    description: 'User id',
    type: 'number',
  })
  .option('env', {
    alias: 'e',
    description: 'Environment',
    type: 'string',
  })
  .option('max-iter', {
    alias: 'm',
    description: 'Maximum iterations',
    type: 'number',
  })
  .option('test-channel', {
    alias: 'c',
    description: 'Channel id to test',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

var userId = argv["uid"] || USER_ID;
var token = argv["token"] || TOKEN;
var env = argv["env"] || ENV;
var maxIter = argv["max-iter"] || MAX_ITERATION;

var webinarUrl = config[env.toLowerCase()].WEBINAR_URL;
var homeUrl = config[env.toLowerCase()].HOME_URL;

var testChannel = argv["c"] || TEST_CHANNEL;


var browser = redline.loadBrowser('firefox');

var By = redline.webdriver.By;
var until = redline.webdriver.until;

browser.get(homeUrl);
browser.manage().addCookie({
  'name'     : 'ttp_auth_' + env,   /* required property */
  'value'    : utils.getValidAuth(token, userId),  /* required property */
  'domain'   : '.tamtam.pro',
  'path'     : '/',                /* required property */
  // 'httponly' : true,
  // 'secure'   : false,
  'expiry'  : (new Date()).getTime()/1000 + 60*60*10   /* <-- expires in 1 hour */
});

var textArea = By.name('msg');
var sendBtn = By.className('rc-message-box__send');

browser.get(webinarUrl);
browser.wait(until.elementLocated(By.className('page-container')));
browser.get(webinarUrl + "/channel/" + testChannel);

browser.manage().timeouts().implicitlyWait(30000);

for (var i = 0; i < maxIter; i++) {
  var message = lorem.generateSentences(Math.floor(Math.random() * 4));
  browser.wait(until.elementLocated(textArea));
  browser.findElement(textArea).sendKeys(message);
  browser.findElement(textArea).sendKeys('.');
  browser.wait(until.elementLocated(sendBtn));
  browser.findElement(sendBtn).click();
  browser.sleep(Math.floor(Math.random() * 10000));
}
browser.quit();
