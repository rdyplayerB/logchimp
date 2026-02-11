<template>
  <div
    class="dropdown"
    :style="style"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	height: {
		type: Number,
		default: 0
	}
})

const style = computed(() => {
	return [
		props.height ? `max-height: ${props.height}px` : '',
		props.height ? 'overflow-y: auto' : ''
	]
})
</script>

<style lang='sass'>
.dropdown
	background-color: var(--bg-secondary)
	backdrop-filter: blur(12px)
	-webkit-backdrop-filter: blur(12px)
	position: absolute
	border: 1px solid var(--border-color-subtle)
	border-radius: var(--border-radius-default)
	padding: 0.375rem 0
	box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3)
	z-index: 8

// dropdown direction
.dropdown.sw
	right: 0
</style>
