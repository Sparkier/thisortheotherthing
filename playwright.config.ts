import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		env: {
			PUBLIC_SUPABASE_URL: 'http://localhost',
			PUBLIC_SUPABASE_ANON_KEY: 'dummy'
		}
	},
	testDir: 'e2e'
});
