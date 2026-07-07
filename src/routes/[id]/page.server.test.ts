import { describe, test, expect, vi, beforeEach } from 'vitest';
import { actions, load } from './+page.server';
import { fail, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

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

describe('load', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('throws 404 for invalid poll ID', async () => {
		const params = { id: 'invalid-id' };
		const cookies = { get: vi.fn() };
		const url = new URL('http://localhost');

		await expect(
			load({
				params,
				cookies: cookies as any,
				url,
				route: { id: '/[id]' },
				getClientAddress: () => '127.0.0.1',
				locals: {},
				platform: {},
				setHeaders: () => {},
				parent: async () => ({}),
				depends: () => {},
				fetch: vi.fn(),
				isDataRequest: false,
				isSubRequest: false
			} as any)
		).rejects.toThrow('404: Invalid poll ID');

		expect(error).toHaveBeenCalledWith(404, 'Invalid poll ID');
	});
});

describe('actions.default', () => {
	const TEST_POLL_ID = '12345678-1234-1234-1234-123456789012';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('returns 400 if choice is invalid', async () => {
		const pollId = TEST_POLL_ID;
		const request = {
			formData: async () => {
				const formData = new FormData();
				formData.append('choice', 'C');
				return formData;
			}
		} as unknown as Request;

		const cookies = {
			get: vi.fn(),
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

		expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid choice' });
		expect(result).toEqual({ status: 400, data: { error: 'Invalid choice' } });
	});

	test('returns 400 if user has already voted', async () => {
		const pollId = TEST_POLL_ID;
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

	test('returns 500 if Supabase insert fails', async () => {
		const pollId = '12345678-1234-1234-1234-123456789012';
		const request = {
			formData: async () => {
				const formData = new FormData();
				formData.append('choice', 'A');
				return formData;
			}
		} as unknown as Request;

		const cookies = {
			get: vi.fn(),
			set: vi.fn()
		};

		const params = { id: pollId };

		// Mock supabase.from().insert() to return an error
		vi.mocked(supabase.from).mockReturnValue({
			insert: vi.fn().mockResolvedValue({ error: new Error('Insert failed') })
		} as any);

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

		expect(fail).toHaveBeenCalledWith(500, { error: 'Failed to record vote' });
		expect(result).toEqual({ status: 500, data: { error: 'Failed to record vote' } });
	});
});
