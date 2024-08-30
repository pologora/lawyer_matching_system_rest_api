import nodemailer from 'nodemailer';

export type EmailProps = {
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  url?: string;
  from?: string;
};

export type SendProps = {
  template: string;
  subject: string;
};

export interface Email {
  to: string;
  url?: string;
  from: string;
  name: string;

  createNewTransport(): nodemailer.Transporter;

  send(props: SendProps): Promise<void>;

  sendWellcomeEmailRegistration(): Promise<void>;

  sendResetPassword(): Promise<void>;

  sendWellcomeSocialRegistration(): Promise<void>;
}
