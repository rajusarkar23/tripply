export function generateOTP(n: number) {
  let OTP = "";

  for (let i = 0; i < n; i++) {
    OTP += Math.floor(Math.random() * 10);
  }

  return OTP;
}
