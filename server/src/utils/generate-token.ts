import * as crypto from 'crypto';
import { OTP_LENGTH } from 'src/constants';

function isPatternForbidden(otp) {
  const allSameDigits = /^(\d)\1+$/;
  return allSameDigits.test(otp);
}

export function generateOTP(length = OTP_LENGTH) {
  let otp;
  do {
    otp = crypto
      .randomInt(0, 10 ** length)
      .toString()
      .padStart(length, '0');
  } while (isPatternForbidden(otp));
  return otp;
}

export function generatePasswordResetToken(length = 32) {
  const result = crypto.randomBytes(length).toString('hex');
  return result;
}
