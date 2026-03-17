import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // 👇 THIS IS THE ABSOLUTE FIX FOR RENDER 👇
            // It strictly forces Nodemailer to use IPv4 instead of IPv6
            family: 4 
        });

        const mailOptions = {
            from: `"ThaliTrack Support" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully: " + info.response); 
    } catch (error) {
        console.error("❌ Email Error Details:", error); 
        throw new Error("Email sending failed");
    }
};

export default sendEmail;