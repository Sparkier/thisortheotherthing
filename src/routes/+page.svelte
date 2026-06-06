<script lang="ts">
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
	<div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">This or That</h1>
			<p class="text-gray-600">Create a poll and see what others think.</p>
		</div>

		<form method="POST" class="space-y-6">
			<div>
				<label for="option_a" class="block text-sm font-medium text-gray-700 mb-1">Option A</label>
				<input
					type="text"
					name="option_a"
					id="option_a"
					required
					placeholder="e.g., Pizza"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
				/>
			</div>

			<div class="relative flex items-center justify-center">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative bg-white px-4 text-sm font-medium text-gray-500">OR</div>
			</div>

			<div>
				<label for="option_b" class="block text-sm font-medium text-gray-700 mb-1">Option B</label>
				<input
					type="text"
					name="option_b"
					id="option_b"
					required
					placeholder="e.g., Burgers"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
				/>
			</div>

			<button
				type="submit"
				class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
			>
				Create Poll
			</button>
		</form>
	</div>
</div>
