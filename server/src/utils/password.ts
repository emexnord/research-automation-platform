import { pbkdf2Sync, randomBytes } from 'crypto';

const hashOptions = {
  iterations: 1000, // Number of iterations
  keyLength: 64, // Length of the derived key
  digest: 'sha512', // Hashing algorithm
};

/**
 *
 * @param password The plaintext password to be hashed.
 * @Param salt The salt to be used for hashing.
 * @returns The hashed password string or null if an error occurred.
 */
export async function hashPassword(
  password: string,
  salt: string,
): Promise<string | undefined> {
  return pbkdf2Sync(
    password,
    salt,
    hashOptions.iterations,
    hashOptions.keyLength,
    hashOptions.digest,
  ).toString('hex');
}

export function generateSalt(): string {
  return randomBytes(16).toString('hex');
}
