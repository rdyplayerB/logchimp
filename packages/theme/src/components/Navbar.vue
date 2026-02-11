<template>
	<nav class="navbar">
		<router-link to="/" class="navbar-item">
			posts
		</router-link>
		<router-link to="/apps" class="navbar-item">
			apps
		</router-link>
	</nav>
</template>

<script setup lang="ts">
</script>

<style lang='sass'>
.navbar
  display: flex
  align-items: center
  gap: 2rem
  margin-top: 1rem
  padding-bottom: 1.5rem
  border-bottom: 1px solid var(--border-color)

.navbar-item
  color: var(--color-text-tertiary)
  font-size: 13px
  font-weight: 400
  letter-spacing: 0.05em
  text-decoration: none
  padding-bottom: 0.5rem
  border-bottom: 1px solid transparent
  margin-bottom: -1px
  transition: all 0.2s ease

  &:hover
    opacity: 0.7

.navbar-item.router-link-exact-active
  color: var(--color-text-primary)
  border-bottom-color: var(--color-text-primary)
</style>
