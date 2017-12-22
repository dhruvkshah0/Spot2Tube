var express = require('express');
var router = express.Router();



//Global constants
const redirectUrl = 'http://localhost:3000/callback/';
const redirectUri = encodeURIComponent(redirectUrl);
const scopes = [`user-read-private`,`playlist-read-private`,`user-library-read`,`playlist-read-collaborative`,`user-read-recently-played`];
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);
const state = generateRandomString(16);


/* GET home page. */
router.get('/', function(req, res, next) {
  let redirectAuth = "https://accounts.spotify.com/authorize?client_id=" + config.spotify.client_id +
  `&response_type=code&state=${state}&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private%20playlist-read-collaborative%20user-library-read%20user-read-recently-played`;
  res.redirect(redirectAuth);
});

module.exports = router;
