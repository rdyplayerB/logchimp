<template>
  <router-link
    v-if="showBoard"
    data-test="board-badge"
    class="board-badge"
    :to="`/apps/${url}`"
  >
    <div class="post-board">
      <div
        class="color-dot"
        data-test="board-badge-color"
        :style="{
          backgroundColor: `#${color}`
        }"
      />
      <p class="post-board-name" data-test="board-badge-name">
        {{ name }}
      </p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
defineProps({
	name: {
		type: String,
		required: true
	},
	color: {
		type: String,
		required: true,
		validator: (value: string) => {
			return value.length === 6;
		}
	},
	url: {
		type: String,
		required: true
	},
	showBoard: {
		type: Boolean,
		required: true
	}
})
</script>

<style lang='sass'>
.board-badge
	display: block
	user-select: none
	text-decoration: none

.post-board
	display: inline-flex
	align-items: center
	padding: 0.25rem 0.625rem
	background-color: rgba(255, 255, 255, 0.03)
	border: 1px solid var(--border-color-subtle)
	border-radius: 1rem
	transition: all 0.2s ease

	&:hover
		background-color: rgba(255, 255, 255, 0.06)
		opacity: 0.8

.post-board-name
	margin-left: 0.375rem
	color: var(--color-text-tertiary)
	font-size: 11px
	letter-spacing: 0.05em
	text-transform: lowercase
</style>
