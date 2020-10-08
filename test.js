var config = require("./config");
var redline = require('redline13-webdriver');
var LoremIpsum = require("lorem-ipsum").LoremIpsum;

var {ENV, EMAIL_PREFIX, EMAIL_SUFFIX, DEFAULT_PASSWORD, MAX_ITERATION, TEST_CHANNEL, CHANNELS} = config;

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
var browser = redline.loadBrowser('firefox');
var testNum = redline.user;

var By = redline.webdriver.By;
var until = redline.webdriver.until;
var Key = redline.webdriver.Key;

var webinarUrl = config[ENV].WEBINAR_URL;
var homeUrl = config[ENV].HOME_URL;
var testChannel =  CHANNELS[Math.floor(Math.random() * CHANNELS.length)] || TEST_CHANNEL;

var email = EMAIL_PREFIX + testNum + EMAIL_SUFFIX;
var password = DEFAULT_PASSWORD;

async function run() {
  await browser.get(homeUrl);
  await browser.wait(until.elementLocated(By.name("email")));
  await browser.findElement(By.name("email")).sendKeys(email);
  await browser.wait(until.elementLocated(By.name("password")));
  await browser.findElement(By.name("password")).sendKeys(password);
  await browser.findElement(By.id("sign-in-button")).click();

  await browser.wait(until.urlContains("landing"));

  var textArea = await By.name('msg');
  await browser.get(webinarUrl);
  await browser.wait(until.urlContains("home"));
  await browser.get(webinarUrl + "/channel/" + testChannel);
  await browser.wait(until.urlContains("channel/" + testChannel));

  await browser.manage().timeouts().implicitlyWait(30000);

  for (var i = 0; i < MAX_ITERATION; i++) {
    var message = "MESSAGE #" + i + ": " + lorem.generateSentences(Math.floor(Math.random() * 4));
    await browser.wait(until.elementLocated(textArea));
    var input = await browser.findElement(textArea);
    await input.sendKeys(message, Key.ENTER);
    console.log(message)
  }
  await browser.quit();
}

run();
