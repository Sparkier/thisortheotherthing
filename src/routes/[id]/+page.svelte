<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isVoting = $state(false);

	let totalVotes = $derived(data.results ? data.results.A + data.results.B : 0);
	let percentA = $derived(totalVotes > 0 && data.results ? Math.round((data.results.A / totalVotes) * 100) : 0);
	let percentB = $derived(totalVotes > 0 && data.results ? Math.round((data.results.B / totalVotes) * 100) : 0);
</script>

<div class="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4 font-mono text-white">
	<div class="max-w-2xl w-full bg-slate-950 border-4 border-fuchsia-500 box-shadow-neon-pink p-8">

		<div class="mb-8">
			<a href="/" class="text-fuchsia-400 hover:text-white hover:text-shadow-neon-white transition-all text-xs font-arcade tracking-wider uppercase">&larr; Main Menu</a>
		</div>

		{#if data.hasVoted && data.results}
			<!-- Results View -->
			<div class="text-center mb-10">
				<h1 class="text-2xl md:text-3xl font-arcade text-white text-shadow-neon-white mb-4 leading-relaxed">GAME OVER<br/><span class="text-fuchsia-400 text-shadow-neon-pink text-xl">RESULTS</span></h1>
				<p class="text-gray-400 text-sm tracking-widest uppercase">SCORE: {totalVotes} {totalVotes === 1 ? 'COIN' : 'COINS'}</p>
			</div>

			<div class="space-y-8 font-bold tracking-wider">
				<!-- Option A Result -->
				<div>
					<div class="flex justify-between mb-2">
						<span class="text-sm md:text-base text-fuchsia-400 uppercase">{data.poll.option_a}</span>
						<span class="text-sm md:text-base text-fuchsia-400">{percentA}% (P1: {data.results.A})</span>
					</div>
					<div class="w-full bg-black border-2 border-gray-700 h-6">
						<div class="bg-fuchsia-500 h-full transition-all duration-1000 ease-out" style="width: {percentA}%"></div>
					</div>
				</div>

				<!-- Option B Result -->
				<div>
					<div class="flex justify-between mb-2">
						<span class="text-sm md:text-base text-cyan-400 uppercase">{data.poll.option_b}</span>
						<span class="text-sm md:text-base text-cyan-400">{percentB}% (P2: {data.results.B})</span>
					</div>
					<div class="w-full bg-black border-2 border-gray-700 h-6">
						<div class="bg-cyan-500 h-full transition-all duration-1000 ease-out" style="width: {percentB}%"></div>
					</div>
				</div>
			</div>

			<div class="mt-12 pt-6 border-t-2 border-dashed border-gray-700 text-center">
				<p class="text-xs font-arcade text-gray-500 mb-4 tracking-widest">Share High Score:</p>
				<input type="text" readonly value="{data.url}" class="w-full bg-black border-2 border-white text-white text-center text-sm px-3 py-3 focus:outline-none focus:border-fuchsia-500 focus:box-shadow-neon-pink transition-all font-mono" onclick={(e) => e.currentTarget.select()} />
			</div>

		{:else}
			<!-- Voting View -->
			<div class="text-center mb-10">
				<h1 class="text-2xl md:text-3xl font-arcade text-white text-shadow-neon-white mb-4 leading-relaxed">CHOOSE<br/>YOUR FIGHTER</h1>
			</div>

			{#if form?.error}
				<div class="mb-8 p-4 text-xs font-arcade text-red-500 bg-black border-2 border-red-500 text-center tracking-widest uppercase">
					{form.error}
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<form method="POST" use:enhance={() => { isVoting = true; return async ({ update }) => { await update(); isVoting = false; } }}>
					<input type="hidden" name="choice" value="A" />
					<button
						type="submit"
						disabled={isVoting}
						class="w-full h-48 flex items-center justify-center p-6 text-xl md:text-2xl font-bold font-arcade uppercase text-fuchsia-400 bg-black border-4 border-fuchsia-500 hover:bg-fuchsia-950 hover:text-shadow-neon-pink hover:box-shadow-neon-pink transition-all active:translate-y-2 disabled:opacity-50 break-words text-center"
					>
						{data.poll.option_a}
					</button>
				</form>

				<form method="POST" use:enhance={() => { isVoting = true; return async ({ update }) => { await update(); isVoting = false; } }}>
					<input type="hidden" name="choice" value="B" />
					<button
						type="submit"
						disabled={isVoting}
						class="w-full h-48 flex items-center justify-center p-6 text-xl md:text-2xl font-bold font-arcade uppercase text-cyan-400 bg-black border-4 border-cyan-500 hover:bg-cyan-950 hover:text-shadow-neon-blue hover:box-shadow-neon-blue transition-all active:translate-y-2 disabled:opacity-50 break-words text-center"
					>
						{data.poll.option_b}
					</button>
				</form>
			</div>
		{/if}
	</div>
</div>
