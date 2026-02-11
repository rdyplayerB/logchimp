<template>
	<router-link :to="link" :class="$style.branding">
		<span :class="$style.name">{{ title }}</span>
	</router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	logo: {
		type: String,
		required: true,
	},
	dashboard: {
		type: Boolean,
		default: false
	},
	textColor: {
		type: String,
		default: "black",
		validator: (value: 'white' | 'black') => ['white', 'black'].includes(value)
	}
})

const link = computed(() =>  props.dashboard ? "/dashboard" : "/")
</script>

<style lang='sass' module>
.branding
	display: flex
	align-items: center
	user-select: none
	transition: opacity 0.2s ease

	&:hover
		opacity: 0.7

.name
	font-size: 13px
	font-weight: 400
	letter-spacing: 0.05em
	text-transform: lowercase
	color: var(--color-text-primary)
</style>
