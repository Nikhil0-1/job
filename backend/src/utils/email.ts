import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const createTransport = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const transporter = createTransport();

  if (!transporter) {
    // Dev fallback: log to console
    console.log('\n📧 [EMAIL SERVICE - DEV MODE]');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.html.replace(/<[^>]*>/g, '')}`);
    console.log('---');
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@jobportal.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const getPasswordResetEmail = (resetUrl: string, name: string) => ({
  subject: 'Reset Your Password – Job Portal',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563EB; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Job Portal</h1>
      </div>
      <div style="padding: 32px; background: #ffffff;">
        <h2 style="color: #0F172A; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #64748B;">Hello ${name},</p>
        <p style="color: #64748B;">We received a request to reset the password for your employer account. Click the button below to reset it.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: #2563EB; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748B; font-size: 14px;">This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
        <p style="color: #64748B; font-size: 14px;">Or copy this link: <a href="${resetUrl}" style="color: #2563EB;">${resetUrl}</a></p>
      </div>
      <div style="padding: 16px; background: #F8FAFC; text-align: center;">
        <p style="color: #94A3B8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
      </div>
    </div>
  `,
});
