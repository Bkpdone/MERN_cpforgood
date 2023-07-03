const nodemailer = require('../middleware/nodemailer');

const SendReq = (value) =>{
    console.log('Send Mailers=> ',value);
    
    let htmlString = nodemailer.renderTemplate({ value: value }, "/Friendreq.ejs")

    let mailOptions = {
        from: 'cpforgood@gmail.com',
        to: value.second.email,
        subject: 'Friends Request',
        html: htmlString
    };

    //use 2
    nodemailer.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error in comment Mailer x xx xxx xxxxx xxxxxxxxxx: ',error);
        } else {

            console.log('Email sent:............. ' + info.response);
        }
    });
}




module.exports =SendReq;