const quote = require('../assets/quotes.json');

function quotes(req, res) {

  const random = Number(getRndInteger(1, 200));
  res.send(quote[random]);
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = quotes;
