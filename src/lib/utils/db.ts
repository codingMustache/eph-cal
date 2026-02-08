import { Pool } from '@neondatabase/serverless';
import { verifyPassword } from '@/utils/password';
import { saltAndHashPassword } from '$lib/utils/password';
import { DATABASE_URL } from '$env/static/private';
const pool = new Pool({
	connectionString: DATABASE_URL
});

export async function getUserFromDb(email: string, password: string) {
	const client = await pool.connect();

	try {
		const result = await client.query(
			`
      SELECT id, name, email, password
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
			[email]
		);

		const user = result.rows[0];

		if (!user) return null;

		const valid = await verifyPassword(password, user.password);

		if (!valid) return null;

		return {
			id: user.id,
			name: user.name,
			email: user.email
		};
	} finally {
		client.release();
	}
}

export async function hasUsers(): Promise<boolean> {
	const result = await pool.query('SELECT COUNT(*) FROM users');
	return Number(result.rows[0].count) > 0;
}

export async function createFirstUser(email: string, password: string, name?: string) {
	const userExists = await hasUsers();

	if (userExists) {
		throw new Error('Signups are disabled');
	}

	const hashed = await saltAndHashPassword(password);

	const result = await pool.query(
		`
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name
    `,
		[email, hashed, name ?? null]
	);

	return result.rows[0];
}
