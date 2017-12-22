var express = require('express');
var router = express.Router();

//global tokens for requesting/refresh/
let access_token = ``;
let refresh_token = ``;
let user_id = ``;

/* GET home page. */
router.get('/', function(req, res, next) {
  const authCode = req.query.code;
  //toke options
  let options = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUrl,
      client_id: config.spotify.client_id,
      client_secret: config.spotify.client_secret,
    },
  };
  request(options, (err, response, body) => {
     if (err) console.log(err);
     else {
       accessToken = JSON.parse(body).access_token;
       refreshToken = JSON.parse(body).refresh_token;
       console.log(JSON.parse(body));
       res.redirect('/home');
     }
   });
});

module.exports = router;
