import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { EmailProps, SendProps } from '../../types/core/Email';

export class Email {
  to: string;
  url: string | undefined;
  from: string;
  name: string;
  constructor({ user, url, from }: EmailProps) {
    this.to = user.email;
    this.url = url;
    this.from = from ?? `Lawyer Matching System <${process.env.DEFAULT_EMAIL_FROM}>`;
    this.name = user.firstName ? `${user.firstName} ${user.lastName}` : '';
  }

  createNewTransport() {
    return nodemailer.createTransport({
      //@ts-expect-error error
      auth: { pass: process.env.EMAIL_PASSWORD!, user: process.env.EMAIL_USERNAME! },
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
    });
  }

  private async send({ template, subject }: SendProps) {
    const path = `${__dirname}/emailTemplates/${template}.pug`;

    const html = pug.renderFile(path, {
      name: this.name,
      subject,
      url: this.url,
    });

    const text = convert(html);

    const mailOptions = {
      from: this.from,
      html,
      subject,
      text,
      to: this.to,
    };

    const transporter = this.createNewTransport();

    return await transporter.sendMail(mailOptions);
  }

  async sendWellcomeEmailRegistration() {
    const template = 'welcome';
    const subject = 'Welcome to the probably the Best Lawyer Matching System - LawMatch!';

    return this.send({ subject, template });
  }

  async sendResetPassword() {
    const template = 'resetPassword';
    const subject = 'Reset Password Link';

    return this.send({ subject, template });
  }

  async sendWellcomeSocialRegistration() {
    const template = 'welcomeSocialRegistration';
    const subject = 'Welcome to the probably the Best Lawyer Matching System - LawMatch!';

    return this.send({ subject, template });
  }
}
