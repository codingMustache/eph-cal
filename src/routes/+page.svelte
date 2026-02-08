<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

	let email = '';
	let password = '';
	let error = '';

	async function handleSubmit() {
		error = '';

		const result = await signIn('credentials', {
			email,
			password,
			redirect: false
		});

		if (!result?.ok) {
			error = 'Invalid email or password';
		} else {
			window.location.href = '/';
		}
	}
</script>

<div>
	<form on:submit|preventDefault={handleSubmit}>
		<label>
			Email
			<input name="email" type="email" bind:value={email} required />
		</label>

		<label>
			Password
			<input name="password" type="password" bind:value={password} required />
		</label>

		<button type="submit"> Log in </button>

		{#if error}
			<p style="color: red">{error}</p>
		{/if}
	</form>
</div>
