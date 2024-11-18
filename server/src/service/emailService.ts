import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'; // Import the SMTP transport type
import config from '../config/config';

const transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
} as SMTPTransport.Options); 




export default {
    sendEmail: async (to: string[], subject: string, text: string, html?: string) => {
        try {
            await transporter.sendMail({
                from: `Task Forge <${config.EMAIL_USER}>`,
                to,
                subject,
                text,
                ...(html && { html })
            });
        } catch (err) {
            throw err;
        }
    }
};
