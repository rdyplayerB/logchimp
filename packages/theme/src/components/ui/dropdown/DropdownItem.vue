<template>
	<div
		class="dropdown-item"
		:class="{
			'dropdown-item-disabled': disabled
		}"
		@click="click"
	>
		<div v-if="isIcon" class="dropdown-item-icon">
			<slot name="icon" />
		</div>
		<div class="dropdown-item-content">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false
	}
})

const isIcon = computed(() => useSlots().icon)

const emit = defineEmits<{
	(e: 'click', event?: any): void
}>();

function click() {
	if (props.disabled) return;
	emit("click");
}
</script>

<style lang='sass'>
.dropdown-item
	border-radius: var(--border-radius-default)
	margin: 0 0.375rem
	padding: 0.5rem 0.75rem
	display: flex
	align-items: center
	cursor: pointer
	user-select: none
	transition: background-color 0.15s ease

	&:hover:not(.dropdown-item-disabled)
		background-color: rgba(255, 255, 255, 0.05)

.dropdown-item-content
	color: var(--color-text-secondary)
	font-weight: 400
	white-space: nowrap

.dropdown-item-icon
	margin-right: 0.625rem
	display: flex

	svg
		width: 1rem
		height: 1rem
		stroke: var(--color-text-tertiary)

.dropdown-menu-icon svg
	stroke: var(--color-text-tertiary)
	width: 1.125rem
	height: 1.125rem

// dropdown item disabled
.dropdown-item-disabled
	opacity: 0.5
	cursor: not-allowed

// dopdown item danger
.dropdown-item.color-danger

	&:hover
		background-color: var(--color-color-danger)

		.dropdown-item-content
			color: var(--color-white)

		.dropdown-item-icon svg
			stroke: var(--color-white)

	.dropdown-item-content
		color: var(--color-color-danger)

	.dropdown-item-icon svg
		stroke: var(--color-color-danger)
</style>
