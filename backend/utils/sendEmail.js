import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            // INSTEAD OF "service: 'gmail'", WE USE EXPLICIT SETTINGS:
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"ThaliTrack Support" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: " + info.response); 
    } catch (error) {
        console.error("Email Error Details:", error); 
        throw new Error("Email sending failed");
    }
};

export default sendEmail;