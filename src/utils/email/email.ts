import nodemailer from 'nodemailer';

type EmailSendOptions = {
  from: string;
  toEmail: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendEmail = async (options: EmailSendOptions) => {
  const transporter = nodemailer.createTransport({
    //@ts-expect-error error
    auth: { user: process.env.EMAIL_USERNAME!, pass: process.env.EMAIL_PASSWORD! },
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  });

  const mailOptions = {
    from: options.from,
    to: options.toEmail,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};
