import { Resend } from 'resend';

const sendEmail = async (options) => {
    try {
        // 👇 MOVED INSIDE THE FUNCTION 👇
        // This guarantees process.env is loaded before it tries to read the key
        const resend = new Resend(process.env.RESEND_API_KEY);

        const data = await resend.emails.send({
            from: 'ThaliTrack <onboarding@resend.dev>', // Resend testing email
            to: options.email, 
            subject: options.subject,
            html: options.message
        });

        console.log("✅ API Email sent successfully:", data); 
    } catch (error) {
        console.error("❌ API Email Error:", error); 
        throw new Error("Email API failed");
    }
};

export default sendEmail;