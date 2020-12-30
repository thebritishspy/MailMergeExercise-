var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("{'preview':'sss'}");
});
router.post('/sendmail', function(req, res, next) {
  let transport = nodemailer.createTransport({
    host: 'smtp.pepipost.com',
    port: 2525,
    auth: {
       user: 'lukasabrie',
       pass: 'Sapristi*78'
    }
});
console.log(req);
var preview  = req.body["template"];
var templateValues = req.body["templateValues"];
for(var key in templateValues){
  preview = preview.replace("%%" + key + "%%",templateValues[key]);
}
const message = {
  from: 'lukasabrie@pepisandbox.com', // Sender address
  to: req.body["email"],         // List of recipients
  subject: req.body["subject"], // Subject line
  text: preview // Plain text body
};
transport.sendMail(message, function(err, info) {
  if (err) {
    console.log(err);
  } else {
    console.log(info);
  }
  res.json({"preview": message.text});
});
  
});

module.exports = router;
