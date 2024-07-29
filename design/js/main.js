document.getElementById('contactForm').addEventListener('submit', async function(event) {
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

    // Send email using serverless function
    async function sendEmail({ name, email, subject, message }) {
        try {
            let response = await fetch('/.netlify/functions/sendEmail', {
                method: 'POST',
                body: JSON.stringify({ name, email, subject, message }),
                headers: { 'Content-Type': 'application/json' }
            });

            let result = await response.json();

            if (response.ok) {
                console.log('Email sent successfully:', result.message);
                toastr.success('Email sent successfully: ' + result.message);
            } else {
                console.error('Failed to send email:', result.error);
                toastr.error('Failed to send email: ' + result.error);
            }
        } catch (error) {
            console.error('Failed to send email:', error);
            toastr.error('Failed to send email: ' + error.message);
        }
    }

    // Call the sendEmail function with the form data
    sendEmail({ name, email, subject, message });
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}
