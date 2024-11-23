import nodemailer from 'nodemailer'

export const sendContactToAdmin = async (email, message, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: name,
        text: message,
        replyTo: email
    };

    await transporter.sendMail(mailOptions);
};