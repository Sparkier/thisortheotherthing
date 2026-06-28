import { describe, test, expect } from 'vitest';
import { actions } from './+page.server';

describe('+page.server.ts actions', () => {
	describe('default action', () => {
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

		test('should return 400 failure when option_a is over 100 characters', async () => {
			const formData = new FormData();
			formData.append('option_a', 'a'.repeat(101));
			formData.append('option_b', 'Option B');

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { too_long: true } });
		});

		test('should return 400 failure when option_b is over 100 characters', async () => {
			const formData = new FormData();
			formData.append('option_a', 'Option A');
			formData.append('option_b', 'b'.repeat(101));

			const request = new Request('http://localhost', {
				method: 'POST',
				body: formData
			});

			const result = await actions.default({ request } as any);
			expect(result).toEqual({ status: 400, data: { too_long: true } });
		});
	});
});
