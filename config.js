var config = {
  "EMAIL": "med.em@gmail.com",
  "PASSWORD": "Aqwxsz32$",
  "ENV": "local",
  "MAX_ITERATION": 10,
  "TEST_CHANNEL": "general",
  "EMAIL_PREFIX": "webinar-test-",
  "EMAIL_SUFFIX": "@mail.com",
  "DEFAULT_PASSWORD": "Aqwxsz32$",
  "CHANNELS": ["channel-01", "channel-2", "channel-3"],
  "local": {
    "WEBINAR_URL": "http://local.webinar-chat.tamtam.pro:3000",
    "HOME_URL": "http://local.home.tamtam.pro",
    "TTP_API_URL": "http://local.api.tamtam.pro",
  },
  "dev": {
    "WEBINAR_URL": "http://dev2.webinar-chat.tamtam.pro",
    "HOME_URL": "http://dev2.tamtam.pro",
  },
  "rc2": {
    "WEBINAR_URL": "http://webinar-chat.rc2.tamtam.pro",
    "HOME_URL": "http://rc2.tamtam.pro",
    "TTP_API_URL": "http://api.rc2.tamtam.pro",
  },
  "TEST_CLIENT": 1,
};

module.exports = config;
