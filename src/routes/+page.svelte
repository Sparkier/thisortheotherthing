<script lang="ts">
</script>

<div
	class="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 font-sans text-gray-800 relative overflow-hidden"
>
	<!-- Soft background blobs -->
	<div
		class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-200/40 rounded-full blur-3xl opacity-60 pointer-events-none"
	></div>
	<div
		class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-200/40 rounded-full blur-3xl opacity-60 pointer-events-none"
	></div>

	<div
		class="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10 relative z-10"
	>
		<div class="text-center mb-10">
			<h1 class="text-4xl font-serif font-medium text-gray-900 mb-3 tracking-tight">
				This or That
			</h1>
			<p class="text-gray-500 text-sm">Create a poll and see what others think.</p>
		</div>

		<form method="POST" class="space-y-6">
			<div>
				<label for="option_a" class="block text-sm font-medium text-gray-700 mb-2"
					>First option</label
				>
				<input
					type="text"
					name="option_a"
					id="option_a"
					required
					placeholder="e.g., Pizza"
					class="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100 transition-all text-gray-900 placeholder-gray-400"
				/>
			</div>

			<div class="relative flex items-center justify-center py-2">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div
					class="relative bg-white/80 px-4 text-xs font-medium text-gray-400 uppercase tracking-widest"
				>
					or
				</div>
			</div>

			<div>
				<label for="option_b" class="block text-sm font-medium text-gray-700 mb-2"
					>Second option</label
				>
				<input
					type="text"
					name="option_b"
					id="option_b"
					required
					placeholder="e.g., Burgers"
					class="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all text-gray-900 placeholder-gray-400"
				/>
			</div>

			<button
				type="submit"
				class="w-full mt-8 flex justify-center py-4 px-4 bg-gray-900 text-white rounded-2xl font-medium shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:bg-gray-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]"
			>
				Create Poll
			</button>
		</form>
	</div>
</div>
