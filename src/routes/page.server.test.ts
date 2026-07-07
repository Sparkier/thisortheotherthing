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
			const formData = new FormData();
			formData.append('option_b', 'Option B');

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when option_b is missing', async () => {
			const formData = new FormData();
			formData.append('option_a', 'Option A');

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when both options are missing', async () => {
			const formData = new FormData();

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when options are just whitespace', async () => {
			const formData = new FormData();
			formData.append('option_a', '   ');
			formData.append('option_b', 'Option B');

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { missing: true } });
		});

		test('should return 400 failure when option_a is over 255 characters', async () => {
			const formData = new FormData();
			formData.append('option_a', 'a'.repeat(256));
			formData.append('option_b', 'Option B');

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { too_long: true } });
		});

		test('should return 400 failure when option_b is over 255 characters', async () => {
			const formData = new FormData();
			formData.append('option_a', 'Option A');
			formData.append('option_b', 'b'.repeat(256));

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { too_long: true } });
		});
	});
});
