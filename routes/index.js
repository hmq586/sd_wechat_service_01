var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
 if( req.query && req.query.echostr) {
    console.log("echostr: " + req.query.echostr);
    res.send(req.query.echostr);
  }
  else
  {  res.send("Index js server");}

});

router.get('/oauth', function (req, res, next) {
  res.send({
    body: req.body,
    url: req.url,
    originalUrl: req.originalUrl
  });
});

module.exports = router;
