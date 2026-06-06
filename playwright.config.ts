import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		env: {
			PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
			PUBLIC_SUPABASE_ANON_KEY: 'fake-key'
		}
	},
	testDir: 'e2e'
});
