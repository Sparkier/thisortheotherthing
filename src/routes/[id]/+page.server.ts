import { error, fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
	const pollId = params.id;

	// Validate UUID structure lightly
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pollId)) {
		error(404, 'Invalid poll ID');
	}

	// Fetch poll
	const { data: poll, error: pollError } = await supabase
		.from('polls')
		.select('*')
		.eq('id', pollId)
		.single();

	if (pollError || !poll) {
		error(404, 'Poll not found');
	}

	const hasVoted = cookies.get(`voted_${pollId}`) === 'true';

	let results = null;

	if (hasVoted) {
		// Fetch results (we can do a simple aggregation if needed, or just fetch all and count)
		// For simplicity with basic Supabase client, fetch counts per choice
		const { data: votesData, error: votesError } = await supabase
			.from('votes')
			.select('choice')
			.eq('poll_id', pollId);

		if (!votesError && votesData) {
			results = {
				A: votesData.filter((v) => v.choice === 'A').length,
				B: votesData.filter((v) => v.choice === 'B').length
			};
		} else {
			results = { A: 0, B: 0 };
		}
	}

	return {
		poll,
		hasVoted,
		results,
		url: url.href
	};
};

export const actions = {
	default: async ({ request, params, cookies }) => {
		const pollId = params.id;
		const data = await request.formData();
		const choice = data.get('choice')?.toString();

		if (choice !== 'A' && choice !== 'B') {
			return fail(400, { error: 'Invalid choice' });
		}

		if (cookies.get(`voted_${pollId}`) === 'true') {
			return fail(400, { error: 'You have already voted' });
		}

		const { error: insertError } = await supabase
			.from('votes')
			.insert([{ poll_id: pollId, choice }]);

		if (insertError) {
			console.error('Error inserting vote:', insertError);
			return fail(500, { error: 'Failed to record vote' });
		}

		// Set cookie valid for 10 years
		cookies.set(`voted_${pollId}`, 'true', {
			path: '/',
			maxAge: 60 * 60 * 24 * 365 * 10
		});

		return { success: true };
	}
} satisfies Actions;
