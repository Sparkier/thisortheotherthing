import { describe, test, expect, vi } from 'vitest';
import { actions } from './+page.server';
import { supabase } from '$lib/supabase';

vi.mock('$lib/supabase', () => {
	const single = vi.fn();
	const select = vi.fn(() => ({ single }));
	const insert = vi.fn(() => ({ select }));
	const from = vi.fn(() => ({ insert }));
	return {
		supabase: {
			from,
			__single: single
		}
	};
});

function createRequest(options: { option_a?: string; option_b?: string } = {}) {
	const formData = new FormData();
	if (options.option_a !== undefined) formData.append('option_a', options.option_a);
	if (options.option_b !== undefined) formData.append('option_b', options.option_b);

	return new Request('http://localhost', {
		method: 'POST',
		body: formData
	});
}

describe('+page.server.ts actions', () => {
	describe('default action', () => {
		test('should return 500 failure when database insertion fails', async () => {
			(supabase as any).__single.mockResolvedValueOnce({
				data: null,
				error: new Error('Database Error')
			});

			const formData = new FormData();
			formData.append('option_a', 'Option A');
			formData.append('option_b', 'Option B');

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 500, data: { error: 'Failed to create poll' } });
		});

		test('should return 400 failure when option_a is missing', async () => {
			const request = createRequest({ option_b: 'Option B' });
			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when option_b is missing', async () => {
			const request = createRequest({ option_a: 'Option A' });
			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when both options are missing', async () => {
			const request = createRequest();
			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when options are just whitespace', async () => {
			const request = createRequest({ option_a: '   ', option_b: 'Option B' });
			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when option_a is over 255 characters', async () => {
			const request = createRequest({ option_a: 'a'.repeat(256), option_b: 'Option B' });
			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { too_long: true } });
		});

		test('should return 400 failure when option_b is over 255 characters', async () => {
			const request = createRequest({ option_a: 'Option A', option_b: 'b'.repeat(256) });
			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { too_long: true } });
		});
	});
});
