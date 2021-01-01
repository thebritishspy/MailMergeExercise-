var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("{'preview':'sss'}");
});


router.post('/sendmail', function(req, res, next) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey('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')
   /* const msg = {
      to: 'lukasabrie@gmail.com', // Change to your recipient
      from: 'lukas.nel@yale.edu', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }*/
    var preview  = req.body["template"];
    var templateValues = req.body["templateValues"];
    for(var key in templateValues){
      preview = preview.replace("%%" + key + "%%",templateValues[key]);
    }
    const msg = {
      from: 'lukas.nel@yale.edu', // Sender address
      to: req.body["email"],         // List of recipients
      subject: req.body["subject"], // Subject line
      text: preview // Plain text body
    };
    sgMail.send(msg).then(() => {console.log('Email sent');
    res.json(msg);}).catch((error) => {console.error(error);  res.json(msg);});  
});

module.exports = router;
