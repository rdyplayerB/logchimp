<template>
	<div :class="$style.card">
		<header v-if="hasHeaderSlot" :class="$style.header">
			<!-- title -->
			<h4 v-if="$slots.title" :class="$style.title">
				<slot name="title" />
			</h4>

			<!-- label -->
			<p v-if="$slots.label" :class="$style.label">
				<slot name="label" />
			</p>
		</header>

		<slot />
	</div>
</template>

<script setup lang="ts">
import { useSlots, computed } from "vue"

const hasHeaderSlot = computed(() => {
	return useSlots().title || useSlots().label
})
</script>

<style module>
.card {
	padding: 2rem;
	background: var(--bg-card);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border: 1px solid var(--border-color-subtle);
	border-radius: 1rem;
}

.header {
	margin-bottom: 1.5rem;
}

.title {
	text-align: center;
	font-size: 14px;
	font-weight: 400;
	letter-spacing: 0.05em;
	text-transform: lowercase;
}

.label {
	text-align: center;
	margin-top: 0.75rem;
	color: var(--color-text-tertiary);
	font-size: 13px;
	letter-spacing: 0.02em;
}
</style>
