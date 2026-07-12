import { error, fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad, Actions } from './$types';

const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10;

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
		// Fetch results using database-level aggregation
		const [
			{ count: countA, error: errorA },
			{ count: countB, error: errorB }
		] = await Promise.all([
			supabase
				.from('votes')
				.select('*', { count: 'exact', head: true })
				.eq('poll_id', pollId)
				.eq('choice', 'A'),
			supabase
				.from('votes')
				.select('*', { count: 'exact', head: true })
				.eq('poll_id', pollId)
				.eq('choice', 'B')
		]);

		if (!errorA && !errorB) {
			results = {
				A: countA || 0,
				B: countB || 0
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
			maxAge: TEN_YEARS_IN_SECONDS,
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		});

		return { success: true };
	}
} satisfies Actions;
