var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("{'preview':'sss'}");
});

const sendmail  = function(member,sgMail){

}
router.post('/sendmail', function(req, res, next) {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey('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');
    var previews = {};
   /* const msg = {
      to: 'lukasabrie@gmail.com', // Change to your recipient
      from: 'lukas.nel@yale.edu', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }*/
    var members = req.body["members"];
    var memberCount = members.length;
    for(var memberkey in members){
      member = members[memberkey];
      console.log(member);
      var preview = req.body["template"];
      var templateValues = member["templateValues"];
      var email = member["email"];
      var subject = member["subject"];
      for(var key in templateValues){
        preview = preview.replace("%%" + key + "%%",templateValues[key]);
      }
      const msg = {
        from: 'lukas.nel@yale.edu', // Sender address
        to: email,         // List of recipients
        subject: subject, // Subject line
        text: preview // Plain text body
      };
      console.log(msg);
     
       sgMail.send(msg).then(
         () => {
            console.log('Email sent');
            memberCount--;
            previews[msg.to] = msg.text;
            if(memberCount == 0)res.json(previews);
          }).catch((error) => {console.error(error);  res.json(msg);});  
    }
   
});

module.exports = router;
