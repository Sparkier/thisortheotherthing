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
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
	<div class="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
		<div class="mb-8">
			<a href="/" class="text-blue-600 hover:underline text-sm font-medium"
				>&larr; Create new poll</a
			>
		</div>

		{#if data.hasVoted && data.results}
			<!-- Results View -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Results</h1>
				<p class="text-gray-500">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total</p>
			</div>

			<div class="space-y-6">
				<!-- Option A Result -->
				<div>
					<div class="flex justify-between mb-1">
						<span class="text-lg font-medium text-gray-700">{data.poll.option_a}</span>
						<span class="text-lg font-bold text-blue-600">{percentA}% ({data.results.A})</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-4">
						<div
							class="bg-blue-600 h-4 rounded-full transition-all duration-500"
							style="width: {percentA}%"
						></div>
					</div>
				</div>

				<!-- Option B Result -->
				<div>
					<div class="flex justify-between mb-1">
						<span class="text-lg font-medium text-gray-700">{data.poll.option_b}</span>
						<span class="text-lg font-bold text-green-600">{percentB}% ({data.results.B})</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-4">
						<div
							class="bg-green-600 h-4 rounded-full transition-all duration-500"
							style="width: {percentB}%"
						></div>
					</div>
				</div>
			</div>

			<div class="mt-8 pt-6 border-t border-gray-100 text-center">
				<p class="text-sm text-gray-500 mb-2">Share this poll:</p>
				<input
					type="text"
					readonly
					value={data.url}
					class="w-full bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
					onclick={(e) => e.currentTarget.select()}
				/>
			</div>
		{:else}
			<!-- Voting View -->
			<div class="text-center mb-10">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Cast your vote</h1>
				<p class="text-gray-600">Which one do you prefer?</p>
			</div>

			{#if form?.error}
				<div class="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
					{form.error}
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<form
					method="POST"
					use:enhance={() => {
						isVoting = true;
						return async ({ update }) => {
							await update();
							isVoting = false;
						};
					}}
				>
					<input type="hidden" name="choice" value="A" />
					<button
						type="submit"
						disabled={isVoting}
						class="w-full h-40 flex items-center justify-center p-6 text-2xl font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-colors disabled:opacity-50"
					>
						{data.poll.option_a}
					</button>
				</form>

				<form
					method="POST"
					use:enhance={() => {
						isVoting = true;
						return async ({ update }) => {
							await update();
							isVoting = false;
						};
					}}
				>
					<input type="hidden" name="choice" value="B" />
					<button
						type="submit"
						disabled={isVoting}
						class="w-full h-40 flex items-center justify-center p-6 text-2xl font-bold text-green-700 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-colors disabled:opacity-50"
					>
						{data.poll.option_b}
					</button>
				</form>
			</div>
		{/if}
	</div>
</div>
