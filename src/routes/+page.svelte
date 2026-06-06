<script lang="ts">
</script>

<div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-mono text-white">
	<div class="max-w-md w-full bg-slate-950 border-4 border-fuchsia-500 box-shadow-neon-pink p-8">
		<div class="text-center mb-10">
			<h1 class="text-3xl font-arcade text-fuchsia-400 text-shadow-neon-pink mb-4 leading-relaxed">THIS<br/><span class="text-white text-xl">OR</span><br/><span class="text-cyan-400 text-shadow-neon-blue">THAT</span></h1>
			<p class="text-gray-400 text-sm mt-4 tracking-widest uppercase">Insert coin to begin</p>
		</div>

		<form method="POST" class="space-y-8">
			<div>
				<label for="option_a" class="block text-xs font-arcade text-fuchsia-400 mb-2 tracking-wider">Player 1</label>
				<input
					type="text"
					name="option_a"
					id="option_a"
					required
					placeholder="e.g., Pizza"
					class="w-full px-4 py-3 bg-black border-2 border-fuchsia-500 text-white placeholder-gray-600 focus:outline-none focus:border-fuchsia-300 focus:ring-1 focus:ring-fuchsia-500 font-bold uppercase tracking-wider"
				/>
			</div>

			<div class="relative flex items-center justify-center">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t-2 border-dashed border-gray-700"></div>
				</div>
				<div class="relative bg-slate-950 px-4 text-xs font-arcade text-gray-500 tracking-widest">VS</div>
			</div>

			<div>
				<label for="option_b" class="block text-xs font-arcade text-cyan-400 mb-2 tracking-wider">Player 2</label>
				<input
					type="text"
					name="option_b"
					id="option_b"
					required
					placeholder="e.g., Burgers"
					class="w-full px-4 py-3 bg-black border-2 border-cyan-500 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-500 font-bold uppercase tracking-wider"
				/>
			</div>

			<button
				type="submit"
				class="w-full flex justify-center py-4 px-4 border-2 border-white text-white font-arcade text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all active:translate-y-1"
			>
				Start Game
			</button>
		</form>
	</div>
</div>
