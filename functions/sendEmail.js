const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    console.log('Received event:', event);
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
            user: process.env.EMAIL_USER, // Use environment variable
            pass: process.env.EMAIL_PASS  // Use environment variable
        }
    });

    // Email to yourself
    let mailOptionsToSelf = {
        from: process.env.EMAIL_USER, // Use environment variable
        replyTo: email,
        to: process.env.EMAIL_USER, // Your email
        subject: subject,
        html: `Name: ${name}<br>Email: ${email}<br>Message: ${message}`
    };

    // Confirmation email to the user
    let mailOptionsToUser = {
        from: process.env.EMAIL_USER, // Use environment variable
        to: email,
        subject: "Thank you for contacting us",
        html: `Dear ${name},<br><br>Thank you for reaching out. We have received your message and will get back to you shortly.<br><br>Best regards,<br>Dhiraj Jirel`
    };

    try {
        // Send email to yourself
        await transporter.sendMail(mailOptionsToSelf);

        // Send confirmation email to the user
        await transporter.sendMail(mailOptionsToUser);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Emails sent successfully' })
        };
    } catch (error) {
        console.error('Failed to send email:', error);
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