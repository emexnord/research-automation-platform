import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function renderTemplate(templatePath: string, variables: Record<string, string>) {
  let html = readFileSync(templatePath, 'utf8');
  for (const [key, value] of Object.entries(variables)) {
    html = html.replace(new RegExp(`{{\s*${key}\s*}}`, 'g'), value);
  }
  return html;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private templateDir: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.templateDir = process.env.EMAIL_TEMPLATE_DIR || resolve(__dirname, '../../constants/email_templates');
  }

  async sendSharedLinkEmail(to: string, link: string, password?: string) {
    const templatePath = resolve(this.templateDir, 'shared_link.html');
    const html = renderTemplate(templatePath, {
      link,
      password: password || '',
    });
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'You have received a shared link',
      html,
    });
  }

  async sendVerificationEmail(to: string, otp: string) {
    const templatePath = resolve(this.templateDir, 'verify_email.html');
    const html = renderTemplate(templatePath, { otp });
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'Verify your email address',
      html,
    });
  }

  async sendWelcomeEmail(to: string) {
    const templatePath = resolve(this.templateDir, 'welcome_email.html');
    const html = renderTemplate(templatePath, {});
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'Welcome to Research Automation Platform',
      html,
    });
  }

  async sendPasswordRecoveryEmail(to: string, link: string) {
    const templatePath = resolve(this.templateDir, 'password_email.html');
    const html = renderTemplate(templatePath, { link });
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'Password Reset Request',
      html,
    });
  }
} 
