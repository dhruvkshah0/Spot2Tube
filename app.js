const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./../config/config');
const async = require('async');

const homeRoute = require('./routes/home');

const app = express();
const redirectUrl = 'http://localhost:3000/callback/';
const redirectUri = encodeURIComponent(redirectUrl);



app.set('views',path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.set('port', process.env.PORT || 3000);

//app.use(favicon(path.join(__dirname, 'public','favicon.ico')));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(cookieParser());
// app.use(session({resave:true,saveUninitialized:true,secret:'edcormwodkvcpwkf',cookie:{maxAge:60000}}));


app.use('/',express.static(path.join(__dirname,'public')));


// // view engine setup
// app.set('views',path.join(__dirname,'views'));
// app.engine('html',require('ejs').renderFile);
// // app.set('view engine','html');
// app.set('port', process.env.PORT || 3000);
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//global tokens for requesting/refresh
let access_token = '';
let refresh_token = '';

app.use('/home', homeRoute);

app.get("/", function(req, res){
    let redirectAuth = "https://accounts.spotify.com/authorize?client_id=" + config.spotify.client_id +
    `&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private%20playlist-read-collaborative%20user-library-read%20user-read-recently-played`;
    res.redirect(redirectAuth);
});


app.get("/callback", function(req, res){
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
     client_secret: config.spotify.client_secret
   },
 };
 request(options, (err, response, body) => {
    if (err) console.log(err);
    else {
      accessToken = JSON.parse(body).access_token;
      refreshToken = JSON.parse(body).refresh_token;
      res.redirect('/home');


  //     getAllPlaylists((playlists,err) => {
  //       if(err) console.log(err);
  //       else {
  //         res.send(playlists);
  //       }
  //     });
    }
  });
});

function getAllPlaylists(callback) {
  let options = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization' : `Bearer ${accessToken}`,
    },
  };
  request(options, (err, response, body) => {
     if (err) callback(null,err);
     else {
       callback(body.items,null);
     }
   });
}


function getAllSongs(callback) {


}



function getVideoLink(callback) {




}
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
