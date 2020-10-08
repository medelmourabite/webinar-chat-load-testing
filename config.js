var config = {
  "EMAIL": "med.em@gmail.com",
  "PASSWORD": "Aqwxsz32$",
  "ENV": "local",
  "MAX_ITERATION": 10,
  "TEST_CHANNEL": "general",
  "EMAIL_PREFIX": "webinar-test-",
  "EMAIL_SUFFIX": "@mail.com",
  "DEFAULT_PASSWORD": "123456789",
  "CHANNELS": ["general"],
  "local": {
    "WEBINAR_URL": "http://local.webinar-chat.tamtam.pro:3000",
    "HOME_URL": "http://local.home.tamtam.pro",
  },
  "dev": {
    "WEBINAR_URL": "http://dev2.webinar-chat.tamtam.pro",
    "HOME_URL": "http://dev2.tamtam.pro",
  },
  "rc2": {
    "WEBINAR_URL": "http://rc2.webinar-chat.tamtam.pro",
    "HOME_URL": "http://rc2.tamtam.pro",
  }
};

module.exports = config;
