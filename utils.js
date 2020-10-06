module.exports = {
  getValidAuth: function (token, id) {
    var createdAt = Math.floor(new Date().getTime() / 1000);
    return encodeURIComponent(JSON.stringify({
      token,
      id,
      createdAt,
      expiresIn: 360000,
      expiry: createdAt + 60 * 60,
    }));
  },
};

