export const REGEX = {
  PHONE_NUMBER: /^[0-9]{10}$/,
  OTP: /^[0-9]{6}$/,
  UPPER_CASE: /[A-Z]/,
  LOWER_CASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SPECIAL_CHAR: /[^A-Za-z0-9]/,
} as const;
