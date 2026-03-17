import axios from 'axios';

const sendEmail = async (options) => {
    try {
        // We use an HTTP POST request to bypass all SMTP port blocks
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                // The sender MUST be the email address you verified in Brevo
                sender: { 
                    name: "ThaliTrack", 
                    email: process.env.EMAIL_USER 
                }, 
                to: [{ email: options.email }], // The user signing up
                subject: options.subject,
                htmlContent: options.message,
            },
            {
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json',
                },
            }
        );

        console.log("✅ Brevo API Email sent successfully"); 
    } catch (error) {
        // This will print the exact reason if Brevo rejects the email
        console.error("❌ Brevo API Error:", error.response ? error.response.data : error.message); 
        throw new Error("Email API failed");
    }
};

export default sendEmail;