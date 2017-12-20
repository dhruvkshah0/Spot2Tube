var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log('here');
  res.render('home');
});

module.exports = router;
