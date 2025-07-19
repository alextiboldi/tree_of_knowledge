import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password with bcrypt
 * @param password - The plaintext password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify a plaintext password against a hash
 * @param password - The plaintext password to verify
 * @param hash - The stored password hash
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * Validate password strength
 * @param password - The password to validate
 * @returns object with isValid boolean and error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password must be less than 128 characters",
    };
  }

  // Must contain at least one letter and one number
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: "Password must contain at least one letter and one number",
    };
  }

  // Check for common weak passwords
  const commonPasswords = [
    "password",
    "password123",
    "123456789",
    "qwerty123",
    "admin123",
    "letmein123",
    "welcome123",
    "password1",
    "123456abc",
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    return {
      isValid: false,
      error: "Password is too common, please choose a stronger password",
    };
  }

  return { isValid: true };
}
