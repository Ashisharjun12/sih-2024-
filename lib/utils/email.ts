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

export const sendFormSubmissionEmail = async (to: string, formType: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Form Submission Confirmation',
    html: `
      <h1>Form Submission Received</h1>
      <p>Thank you for submitting your ${formType} application. Our team will review it shortly.</p>
      <p>We will notify you once your application has been reviewed.</p>
    `,
  });
};

export const sendFormApprovalEmail = async (to: string, formType: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Application Approved!',
    html: `
      <h1>Congratulations!</h1>
      <p>Your ${formType} application has been approved.</p>
      <p>You now have access to the ${formType} features on our platform.</p>
      <p>Login to your account to get started.</p>
    `,
  });
};

export const sendFormRejectionEmail = async (to: string, formType: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Application Status Update',
    html: `
      <h1>Application Update</h1>
      <p>We regret to inform you that your ${formType} application could not be approved at this time.</p>
      <p>Feel free to submit a new application with updated information.</p>
    `,
  });
}; 