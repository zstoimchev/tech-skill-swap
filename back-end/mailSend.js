// to reset the password
const nodemailer = require('nodemailer');
require('dotenv').config();


async function sendEmail(userEmail, resetToken) {
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.MY_EMAIL,
    //         pass: process.env.MY_PASSWORD
    //     }
    // });

    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', // Use the Outlook SMTP server
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD
        },
        tls: {
            ciphers:'SSLv3'
        }
    });

    let mailOptions = {
        from: process.env.MY_EMAIL,
        to: userEmail,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
               http://localhost:3000/reset/${resetToken}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }

}

sendEmail('zike.stoimcev@gmail.com', 'resetToken123');
