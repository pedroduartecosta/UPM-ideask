var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
  "emailAddress": "walter@white.com",
  "password": "$2a$10$yTYsvmlqwNJ0Gc5iJ1SSderKy3L74Uj81LmKUcaGZMG9uqNqkyqqy"
};

exports.login = function (request, done) {
  request
    .post('/api/v1/entrance/login')
    .send(theAccount)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};