var config = require("./config");
var redline = require('redline13-webdriver');
var LoremIpsum = require("lorem-ipsum").LoremIpsum;
var fs = require("fs");
const parse = require('csv-parse');
var {ENV, MAX_ITERATION, TEST_CHANNEL, CHANNELS} = config;

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


var testNum = redline.user || 5;

var By = redline.webdriver.By;
var until = redline.webdriver.until;
var Key = redline.webdriver.Key;

var webinarUrl = config[ENV].WEBINAR_URL;

var browser = redline.loadBrowser('firefox');

var testChannel =  CHANNELS[Math.floor(Math.random() * CHANNELS.length)] || TEST_CHANNEL;


function getValidToken(token, id) {
  var createdAt = Math.floor(new Date().getTime() / 1000);
  return encodeURIComponent(JSON.stringify({
    token,
    id,
    createdAt,
    expiresIn: 360000,
    expiry: createdAt + 60 * 60,
  }));
}

async function run(token, userId) {

  var textArea = await By.name('msg');

  await browser.get(webinarUrl);
  await browser.manage().addCookie({
    'name'     : 'ttp_auth_' + ENV,
    'value'    : getValidToken(token, userId),
    'domain'   : '.tamtam.pro',
    'path'     : '/',
    'expiry'  : (new Date()).getTime()/1000 + 60*60*10
  });

  await browser.wait(function() {
    return browser.manage().getCookie('ttp_auth_' + ENV).then(cookie => {
      return cookie || null;
    })
  });
  await browser.get(webinarUrl);

  await browser.wait(until.elementLocated(By.className("page-home")));
  await browser.get(webinarUrl + "/channel/" + testChannel);
  await browser.wait(until.urlContains("channel/" + testChannel)).catch(err => {
    browser.get(webinarUrl);
    browser.get(webinarUrl + "/channel/" + testChannel);
  });

  await browser.wait(until.elementLocated(textArea), 2000).catch(err => {
    browser.navigate().refresh();
  });

  await browser.manage().timeouts().implicitlyWait(30000);

  for (var i = 0; i < MAX_ITERATION; i++) {
    var message = "MESSAGE #" + i + ": " + lorem.generateSentences(Math.floor(Math.random() * 4));
    await browser.wait(until.elementLocated(textArea));
    var input = await browser.findElement(textArea);
    await input.sendKeys(message);
    await browser.sleep(Math.floor(Math.random() * 5 + 1) * 500);
    await input.sendKeys('.', Key.ENTER);
    await browser.sleep(Math.floor(Math.random() * 10 + 1) * 1000);
    console.log(message)
  }
  await browser.quit();
}


var parser = parse({from_line: testNum, to_line: testNum}, function (err, line) {
  if(err) throw err;
  var id = line[0][0];
  var token = line[0][1];
  run(token, id);
});


// fs.createReadStream(__dirname+'/tokens-1602512212092.csv').pipe(parser);
fs.createReadStream(__dirname+'/tokens-local-1602516339036.csv').pipe(parser);
