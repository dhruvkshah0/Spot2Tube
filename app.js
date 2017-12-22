const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./../config/config');
const async = require('async');

//Express app
const app = express();

//Routes
const homeRoute = require('./routes/home');
const callbackRoute = require('./routes/callback');
const indexRoute = require('./routes/index');



app.set('views',path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRoute);
app.use('/home', homeRoute);
app.use('/callback',callbackRoute);

// app.get("/", function(req, res){
//     let redirectAuth = "https://accounts.spotify.com/authorize?client_id=" + config.spotify.client_id +
//     `&response_type=code&state=${state}&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private%20playlist-read-collaborative%20user-library-read%20user-read-recently-played`;
//     res.redirect(redirectAuth);
// });
//
//
// app.get("/callback", function(req, res){
//  const authCode = req.query.code;
//  //toke options
//  let options = {
//    method: 'POST',
//    url: 'https://accounts.spotify.com/api/token',
//    headers: { 'content-type': 'application/x-www-form-urlencoded' },
//    form: {
//      grant_type: 'authorization_code',
//      code: authCode,
//      redirect_uri: redirectUrl,
//      client_id: config.spotify.client_id,
//      client_secret: config.spotify.client_secret,
//    },
//  };
//  request(options, (err, response, body) => {
//     if (err) console.log(err);
//     else {
//       accessToken = JSON.parse(body).access_token;
//       refreshToken = JSON.parse(body).refresh_token;
//       console.log(JSON.parse(body));
//       res.redirect('/home');
//     }
//   });
// });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
