<template>
	<nav class="navbar">
		<router-link to="/" class="navbar-subtitle">
			<span v-if="!isHomepage">← </span>all apps
		</router-link>
	</nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isHomepage = computed(() => route.path === "/");
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
