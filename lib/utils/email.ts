import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

export const getApprovalEmailTemplate = (userName: string, role: string) => `
  <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://your-logo-url.com" alt="StartupHub Logo" style="height: 40px;" />
    </div>
    
    <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
      <h2 style="color: #15803d; font-size: 24px; font-weight: 600; margin: 0 0 10px;">
        🎉 Application Approved!
      </h2>
      <p style="color: #166534; font-size: 16px; margin: 0;">
        Your ${role} application has been successfully approved.
      </p>
    </div>

    <div style="color: #374151; font-size: 16px; line-height: 1.6;">
      <p>Dear ${userName},</p>
      
      <p>We're excited to welcome you to StartupHub! Your application as a ${role} has been reviewed and approved by our team.</p>
      
      <p>What's next:</p>
      <ul style="padding-left: 20px;">
        <li>Access your personalized ${role} dashboard</li>
        <li>Complete your profile setup</li>
        <li>Connect with our community</li>
        <li>Explore available resources</li>
      </ul>

      <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <p style="margin: 0; font-weight: 500;">
          🚀 Login to your account to get started:
          <a href="${process.env.NEXTAUTH_URL}/signin" 
             style="color: #2563eb; text-decoration: none; font-weight: 600;">
            Access Dashboard
          </a>
        </p>
      </div>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        Best regards,<br />
        The StartupHub Team
      </p>
    </div>
  </div>
`;

export const getRejectionEmailTemplate = (userName: string, role: string) => `
  <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://your-logo-url.com" alt="StartupHub Logo" style="height: 40px;" />
    </div>
    
    <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
      <h2 style="color: #991b1b; font-size: 24px; font-weight: 600; margin: 0 0 10px;">
        Application Status Update
      </h2>
      <p style="color: #991b1b; font-size: 16px; margin: 0;">
        Regarding your ${role} application
      </p>
    </div>

    <div style="color: #374151; font-size: 16px; line-height: 1.6;">
      <p>Dear ${userName},</p>
      
      <p>Thank you for your interest in joining StartupHub as a ${role}. After careful review of your application, we regret to inform you that we are unable to approve it at this time.</p>
      
      <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <p style="margin: 0; font-weight: 500;">
          💡 You can submit a new application after addressing the following:
        </p>
        <ul style="margin: 10px 0 0; padding-left: 20px;">
          <li>Review our eligibility criteria</li>
          <li>Update your documentation</li>
          <li>Provide more detailed information</li>
        </ul>
      </div>

      <p>If you have any questions or need clarification, please don't hesitate to contact our support team.</p>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        Best regards,<br />
        The StartupHub Team
      </p>
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/contact" 
           style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
          Contact Support
        </a>
      </div>
    </div>
  </div>
`; 