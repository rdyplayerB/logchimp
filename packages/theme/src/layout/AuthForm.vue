<template>
	<div class="auth-form">
		<slot />
	</div>
</template>

<script lang="ts">
export default {
	name: "AuthFormLayout"
};
</script>

<style lang='sass'>
.auth-form
	width: 24rem
	padding: 0 1rem
	margin-top: 3rem
	margin-left: auto
	margin-right: auto

.auth-form-header
	margin-bottom: 2rem
	display: flex
	flex-direction: column
	align-items: center

.auth-form-heading
	font-weight: 400
	text-align: center
	margin-top: 1rem
	margin-bottom: 0
	color: var(--color-text-primary)

.auth-form-other
	font-size: 0.8rem
	text-align: center
	color: var(--color-text-tertiary)
	margin-top: 1.5rem
</style>
