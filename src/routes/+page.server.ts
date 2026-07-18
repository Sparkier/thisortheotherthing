import { redirect, fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const optionA = data.get('option_a')?.toString().trim();
		const optionB = data.get('option_b')?.toString().trim();

		if (!optionA || !optionB) {
			return fail(400, { missing: true });
		}

		if (optionA.length > 255 || optionB.length > 255) {
			return fail(400, { too_long: true });
		}

		const { data: poll, error } = await supabase
			.from('polls')
			.insert([{ option_a: optionA, option_b: optionB }])
			.select()
			.single();

		if (error) {
			console.error('Error creating poll:', error.message);
			return fail(500, { error: 'Failed to create poll' });
		}

		if (poll && poll.id) {
			redirect(303, `/${poll.id}`);
		}

		return fail(500, { error: 'Failed to create poll' });
	}
} satisfies Actions;
