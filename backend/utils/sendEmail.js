import nodemailer from 'nodemailer';
import dns from 'dns';

// 🛑 THIS IS THE MAGIC FIX FOR RENDER 🛑
// It forces the server to use standard IPv4 networks, bypassing the IPv6 timeout bug.
dns.setDefaultResultOrder('ipv4first');

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
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
            }
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