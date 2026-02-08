import { json } from '@sveltejs/kit';
import { hasUsers } from '$lib/utils/db';

export async function GET() {
	return json({
		canSignup: !(await hasUsers())
	});
}
