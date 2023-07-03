const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'cpforgood@gmail.com',
        pass: 'yjbficrdxdfnarzf'
    }
});


let renderTemplate = (data, relativePath) => {

    let mailHTML;
    ejs.renderFile(path.join(__dirname, '../emailpages', relativePath), data, function (err, template) {

        if (err) {
            console.log('Error in Render Ejs x x x', err);
            return;
        }
       // console.log('HI Bhavesh Sir Template Email: ',template);
        mailHTML = template;
    });
    
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}

