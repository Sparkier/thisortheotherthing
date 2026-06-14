import { describe, test, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';
import { fail } from '@sveltejs/kit';

// Mock SvelteKit fail
vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn((status, data) => ({ status, data })),
		error: vi.fn((status, message) => {
			throw new Error(`${status}: ${message}`);
		})
	};
});

// Mock Supabase
vi.mock('$lib/supabase', () => ({
	supabase: {
		from: vi.fn()
	}
}));

describe('actions.default', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('returns 400 if user has already voted', async () => {
		const pollId = '12345678-1234-1234-1234-123456789012';
		const request = {
			formData: async () => {
				const formData = new FormData();
				formData.append('choice', 'A');
				return formData;
			}
		} as unknown as Request;

		const cookies = {
			get: vi.fn((name) => {
				if (name === `voted_${pollId}`) return 'true';
				return undefined;
			}),
			set: vi.fn()
		};

		const params = { id: pollId };

		const result = await actions.default({
			request,
			params,
			cookies: cookies as any,
			url: new URL('http://localhost') as any,
			getClientAddress: () => '127.0.0.1',
			locals: {},
			platform: {},
			route: { id: '/[id]' },
			isDataRequest: false,
			isSubRequest: false,
			setHeaders: () => {}
		} as any);

		expect(cookies.get).toHaveBeenCalledWith(`voted_${pollId}`);
		expect(fail).toHaveBeenCalledWith(400, { error: 'You have already voted' });
		expect(result).toEqual({ status: 400, data: { error: 'You have already voted' } });
	});
});
