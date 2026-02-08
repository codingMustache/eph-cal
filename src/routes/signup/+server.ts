import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { createFirstUser } from '$lib/utils/db';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().optional()
});

export async function POST({ request }) {
	try {
		const body = await request.json();

		const { email, password, name } = schema.parse(body);

		const user = await createFirstUser(email, password, name);

		return json(user);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		return json({ error: err.message ?? 'Signup failed' }, { status: 400 });
	}
}
