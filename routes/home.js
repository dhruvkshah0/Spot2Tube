var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home.html');
});

router.post("/getMusic", function (req,res){

  getAllMusic((songs,err) => {
    if(err) console.log(err);
    else if (songs && songs.length > 0) {
      res.send(songs);
    }
  });
});


function getAllMusic(callback) {
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
       data = JSON.parse(body).items;
       async.each(data, (playlist,callback) =>{
         console.log(`Play list: ${playlist}`);
       },
     (err) =>{
       if(err) console.log(err);
       callback(`Done`,null);
     });
     }
   });
}


function getPlaylistSongs(playlist,callback) {
  const playlistId = playlist.id;
  // const playlistSize = playlist.size;
  let options = {
    method: 'GET',
    url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlistId}/tracks`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization' : `Bearer ${accessToken}`,
    },
  };
  request(options, (err, response, body) => {
 });
}



function getVideoLink(callback) {




}

module.exports = router;
