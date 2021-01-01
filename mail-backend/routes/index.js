var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Welcome to the Mail Merge Api");
});


module.exports = router;
