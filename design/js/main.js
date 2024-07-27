document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Form validation
    var name = document.getElementById('floatingName').value;
    var email = document.getElementById('floatingEmail').value;
    var subject = document.getElementById('floatingSubject').value;
    var message = document.getElementById('floatingMessage').value;

    if (name === '' || email === '' || subject === '' || message === '') {
        toastr.error('Please fill in all fields.');
        return;
    }

    if (!validateEmail(email)) {
        toastr.error('Please enter a valid email address.');
        return;
    }

    // SMTP.js email sending
    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "jldhiraj123@gmail.com", // Replace with your Gmail address
        Password: "C2841F4F5DE46E75FE5EBFB5F7BAF8A2C64C", // Replace with your Gmail password or app password
        To: 'jldhiraj123@gmail.com',
        From: email,
        Subject: subject,
        Body: `Name: ${name}<br>Email: ${email}<br>Message: ${message}`,
        Port: 2525
    }).then(
        message => {
            console.log('Email sent successfully:', message);
            toastr.success('Email sent successfully: ' + message);
        }
    ).catch(
        error => {
            console.error('Failed to send email:', error);
            toastr.error('Failed to send email: ' + error);
        }
    );
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}
