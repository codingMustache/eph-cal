import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash password for storing in DB
 */
export async function saltAndHashPassword(password: string) {
	return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify login password against stored hash
 */
export async function verifyPassword(password: string, hashedPassword: string) {
	return bcrypt.compare(password, hashedPassword);
}
