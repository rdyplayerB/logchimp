<template>
	<component
		:is="href ? 'a' : 'button'"
		class="button"
		:class="{
			[`button-${type}`]: !!type,
			'button-loading': loading,
			'button-primary-disabled': disabled,
			'button-outline': outline,
			[$style['button-size-small']]: size === 'small',
			[$style['button-size-medium']]: size === 'medium',
      'w-full': fullWidth,
		}"
		:href="href"
		@click="click"
	>
		<slot />
		<div v-if="loading" class="button-loader">
			<loader-icon />
		</div>
	</component>
</template>

<script lang="ts">
type ButtonSize = 'small' | 'medium'
</script>

<script setup lang="ts">
// icons
import LoaderIcon from "../icons/Loader.vue";

const props = defineProps({
	href: {
		type: String,
		default: null,
	},
	type: {
		type: String,
		required: true
	},
	size: {
		type: String,
		default: 'medium',
		validator: (value: ButtonSize) => ['small', 'medium'].includes(value),
	},
	outline: {
		type: Boolean,
		default: false
	},
	loading: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	fullWidth: {
		type: Boolean,
		default: false
	},
})

const emit = defineEmits(['click'])

function click() {
	if (props.loading) return;
	if (props.disabled) return;
	emit("click");
}
</script>

<style lang='sass'>
.button
	// normalise button
	border: none
	padding: 0
	font-family: inherit
	font-size: 13px
	letter-spacing: 0.05em
	position: relative
	border-radius: var(--border-radius-default)
	font-weight: 400
	display: flex
	justify-content: center
	cursor: pointer
	user-select: none
	line-height: 20px
	transition: all 0.15s ease

.button-loader
	border-radius: var(--border-radius-default)
	display: flex
	justify-content: center
	align-items: center
	width: 100%
	height: 100%
	position: absolute
	top: 0
	bottom: 0
	left: 0
	right: 0
	cursor: default

	svg
		width: 1.5rem
		height: 1.5rem
		animation-name: spinner
		animation-duration: 1.1s
		animation-direction: normal
		animation-timing-function: linear
		animation-iteration-count: infinite

.button-loading
	opacity: 0.8
	cursor: wait

@keyframes spinner
	0%
		transform: rotate(0deg)

	100%
		transform: rotate(360deg)

.button-primary
	background-color: var(--color-text-primary)
	color: var(--bg-primary)

	&:hover
		opacity: 0.85

	.button-loader
		background-color: var(--color-text-primary)

		svg
			stroke: var(--bg-primary)

.button-outline
	border: 1px solid var(--border-color)
	background-color: transparent
	color: var(--color-text-secondary)

	&:hover
		border-color: var(--border-color-hover)
		color: var(--color-text-primary)

.button-background
	color: var(--color-text-secondary)
	background-color: var(--bg-secondary)

	.button-loader
		background-color: var(--bg-secondary)

		svg
			stroke: var(--color-text-tertiary)

	&:hover
		background-color: rgba(255, 255, 255, 0.05)

.button-primary-disabled
	opacity: 0.5
	cursor: not-allowed
</style>

<style lang='sass' module>
// size
.button-size-small
	padding: 0.375rem 0.75rem
	height: 2rem

.button-size-medium
	padding: 0.625rem 1.25rem
	height: 2.625rem
</style>
