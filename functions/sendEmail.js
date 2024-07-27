const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    const { name, email, subject, message } = JSON.parse(event.body);

    if (!validateEmail(email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Please enter a valid email address.' })
        };
    }

    let transporter = nodemailer.createTransport({
        host: "smtp.elasticemail.com",
        port: 2525,
        auth: {
            user: process.env.EMAIL_USER, // Set these in Netlify environment variables
            pass: process.env.EMAIL_PASS  // Set these in Netlify environment variables
        }
    });

    let mailOptions = {
        from: email,
        to: 'jldhiraj123@gmail.com',
        subject: subject,
        html: `Name: ${name}<br>Email: ${email}<br>Message: ${message}`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully: ' + info.response })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email: ' + error.message })
        };
    }
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}