const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./../config/config');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const redirectUrl = 'http://localhost:3000/callback/';
const redirectUri = encodeURIComponent(redirectUrl);
var access_token = '';
var refresh_token = '';
app.get("/", function(req, res){
    var redirectAuth = "https://accounts.spotify.com/authorize?client_id=" + config.spotify.client_id +
    `&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private%20playlist-read-collaborative%20user-library-read%20user-read-recently-played`;
    res.redirect(redirectAuth);
});


app.get("/callback", function(req, res){
 var authCode = req.query.code;

 var options = {
   method: 'POST',
   url: 'https://accounts.spotify.com/api/token',
   headers: { 'content-type': 'application/x-www-form-urlencoded' },
   form: {
     grant_type: 'authorization_code',
     code: authCode,
     redirect_uri: redirectUrl,
     client_id: config.spotify.client_id,
     client_secret: config.spotify.client_secret
   },
 };
 request(options, function (error, response, body) {
    if (error) console.log(err)
    else {
      console.log(body);
      accessToken = JSON.parse(body).access_token;
      refreshToken = JSON.parse(body).refresh_token;

    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
