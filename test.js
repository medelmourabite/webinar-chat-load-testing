var config = require("./config");
var redline = require('redline13-webdriver');
var yargs = require('yargs');
var LoremIpsum = require("lorem-ipsum").LoremIpsum;

var {ENV, EMAIL, PASSWORD, MAX_ITERATION, TEST_CHANNEL} = config;

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
  .option('email', {
    alias: 'e',
    description: 'User email',
    type: 'string',
  })
  .option('password', {
    alias: 'p',
    description: 'User password',
    type: 'string',
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

var email = argv["emil"] || EMAIL;
var password = argv["password"] || PASSWORD;
var env = argv["env"] || ENV;
var maxIter = argv["max-iter"] || MAX_ITERATION;

var webinarUrl = config[env.toLowerCase()].WEBINAR_URL;
var homeUrl = config[env.toLowerCase()].HOME_URL;

var testChannel = argv["c"] || TEST_CHANNEL;


var browser = redline.loadBrowser('firefox');

var By = redline.webdriver.By;
var until = redline.webdriver.until;
var Key = redline.webdriver.Key;

async function run() {
  await browser.get(homeUrl);
  await browser.wait(until.elementLocated(By.name("email")));
  await browser.findElement(By.name("email")).sendKeys(email);
  await browser.wait(until.elementLocated(By.name("password")));
  await browser.findElement(By.name("password")).sendKeys(password);
  await browser.findElement(By.id("sign-in-button")).click();

  var textArea = await By.name('msg');

  await browser.wait(until.urlContains("landing"));
  await browser.get(webinarUrl);
  await browser.wait(until.urlContains("home"));
  await browser.get(webinarUrl + "/channel/" + testChannel);

  await browser.manage().timeouts().implicitlyWait(30000);

  for (var i = 0; i < maxIter; i++) {
    var message = lorem.generateSentences(Math.floor(Math.random() * 4));
    await browser.wait(until.elementLocated(textArea));
    var input = await browser.findElement(textArea);
    await input.sendKeys(message, Key.ENTER);
  }
  await browser.quit();
}

run();
