<template>
	<nav class="navbar">
		<router-link to="/" class="navbar-subtitle">← user feedback</router-link>
	</nav>
</template>

<script setup lang="ts">
</script>

<style lang='sass'>
.navbar
  display: flex
  align-items: center
  margin-top: 1rem
  padding-bottom: 1.5rem
  border-bottom: 1px solid var(--border-color)

.navbar-subtitle
  color: var(--color-text-tertiary)
  font-size: 12px
  font-weight: 400
  letter-spacing: 0.08em
  text-transform: lowercase
  text-decoration: none
  transition: color 0.2s ease

  &:hover
    color: var(--color-text-primary)
    text-decoration: underline
</style>
