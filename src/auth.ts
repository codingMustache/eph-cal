import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import { Pool } from '@neondatabase/serverless';
import NeonAdapter from '@auth/neon-adapter';
import { z, ZodError } from 'zod';
import { getUserFromDb } from '$lib/utils/db';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});
export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: NeonAdapter(pool),
	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			authorize: async (credentials) => {
				try {
					if (!credentials) return null;

					const { email, password } = await loginSchema.parseAsync(credentials);

					const user = await getUserFromDb(email, password);

					if (!user) return null;

					return user;
				} catch (error) {
					if (error instanceof ZodError) {
						return null;
					}

					console.error('Auth error:', error);
					return null;
				}
			}
		})
	]
});
