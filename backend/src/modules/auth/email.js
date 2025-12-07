import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendOtpEmail(to, otp) {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || '"Meal Planner" <no-reply@example.com>',
    to,
    subject: "Your login OTP code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 5 minutes.</p>`
  });

  console.log("OTP email sent:", info.messageId);
}
