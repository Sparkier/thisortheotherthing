<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isVoting = $state(false);

	let totalVotes = $derived(data.results ? data.results.A + data.results.B : 0);
	let percentA = $derived(
		totalVotes > 0 && data.results ? Math.round((data.results.A / totalVotes) * 100) : 0
	);
	let percentB = $derived(
		totalVotes > 0 && data.results ? Math.round((data.results.B / totalVotes) * 100) : 0
	);

	let pollOptions = $derived([
		{
			id: 'A',
			text: data.poll.option_a,
			percent: percentA,
			votes: data.results?.A ?? 0,
			colorClass: 'text-rose-500',
			bgColorClass: 'bg-rose-400',
			btnTextClass: 'text-rose-900',
			btnBgClass: 'bg-rose-50',
			btnHoverBorderClass: 'hover:border-rose-200',
			btnHoverBgClass: 'hover:bg-rose-100'
		},
		{
			id: 'B',
			text: data.poll.option_b,
			percent: percentB,
			votes: data.results?.B ?? 0,
			colorClass: 'text-indigo-500',
			bgColorClass: 'bg-indigo-400',
			btnTextClass: 'text-indigo-900',
			btnBgClass: 'bg-indigo-50',
			btnHoverBorderClass: 'hover:border-indigo-200',
			btnHoverBgClass: 'hover:bg-indigo-100'
		}
	]);
</script>

<div
	class="min-h-screen bg-[#FDFBF7] flex flex-col items-center py-16 px-4 font-sans text-gray-800 relative overflow-hidden"
>
	<!-- Soft background blobs -->
	<div
		class="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-200/40 rounded-full blur-3xl opacity-50 pointer-events-none"
	></div>
	<div
		class="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-3xl opacity-50 pointer-events-none"
	></div>

	<div
		class="max-w-3xl w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 relative z-10"
	>
		<div class="mb-10">
			<a
				href="/"
				class="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path></svg
				>
				Create new poll
			</a>
		</div>

		{#if data.hasVoted && data.results}
			<!-- Results View -->
			<div class="text-center mb-12">
				<h1 class="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-4 tracking-tight">
					The results are in
				</h1>
				<p class="text-gray-500 font-medium">
					{totalVotes}
					{totalVotes === 1 ? 'person has' : 'people have'} voted
				</p>
			</div>

			<div class="space-y-8 max-w-xl mx-auto">
				{#each pollOptions as option (option.id)}
					<div>
						<div class="flex justify-between items-end mb-3">
							<span class="text-lg font-medium text-gray-900">{option.text}</span>
							<div class="text-right">
								<span class="text-xl font-bold {option.colorClass}">{option.percent}%</span>
								<span class="text-sm text-gray-400 ml-2">({option.votes} votes)</span>
							</div>
						</div>
						<div class="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
							<div
								class="{option.bgColorClass} h-full rounded-full transition-all duration-1000 ease-out"
								style="width: {option.percent}%"
							></div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-16 pt-8 border-t border-gray-100/60 max-w-md mx-auto text-center">
				<p class="text-sm font-medium text-gray-500 mb-3">Share this poll to get more votes</p>
				<input
					type="text"
					readonly
					value={data.url}
					class="w-full bg-gray-50 border border-gray-200 text-gray-600 text-center text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all cursor-copy"
					onclick={(e) => e.currentTarget.select()}
				/>
			</div>
		{:else}
			<!-- Voting View -->
			<div class="text-center mb-12">
				<h1 class="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-4 tracking-tight">
					Cast your vote
				</h1>
				<p class="text-gray-500 text-lg">Which one do you prefer?</p>
			</div>

			{#if form?.error}
				<div
					class="mb-8 p-4 text-sm font-medium text-red-600 bg-red-50 rounded-2xl text-center border border-red-100"
				>
					{form.error}
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{#each pollOptions as option (option.id)}
					<form
						method="POST"
						class="h-full"
						use:enhance={() => {
							isVoting = true;
							return async ({ update }) => {
								await update();
								isVoting = false;
							};
						}}
					>
						<input type="hidden" name="choice" value={option.id} />
						<button
							type="submit"
							disabled={isVoting}
							class="w-full h-56 flex flex-col items-center justify-center p-8 text-2xl md:text-3xl font-medium {option.btnTextClass} {option.btnBgClass} border-2 border-transparent {option.btnHoverBorderClass} {option.btnHoverBgClass} rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 break-words text-center group"
						>
							{option.text}
						</button>
					</form>
				{/each}
			</div>
		{/if}
	</div>
</div>
