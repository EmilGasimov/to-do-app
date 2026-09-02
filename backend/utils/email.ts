import nodemailer from 'nodemailer';

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = nodemailer.createTestAccount().then((account) =>
      nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: account.user, pass: account.pass },
      })
    );
  }
  return transporterPromise;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: '"Todo App" <no-reply@todoapp.test>',
    to,
    subject: 'Reset your password',
    html: `<p>Click below to reset your password. This link expires in 1 hour.</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  console.log('Password reset email preview:', nodemailer.getTestMessageUrl(info));
}