// backend/src/modules/auth/email.js

// For this project we do not use a real SMTP account.
// We just log the OTP to the server console so it can be used in the demo.

export async function sendOtpEmail(to, otp) {
  console.log(`[DEV] OTP for ${to}: ${otp}`);
}
