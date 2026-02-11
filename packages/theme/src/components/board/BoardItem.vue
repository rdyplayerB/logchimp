<template>
  <router-link
    data-test="board-item"
    :to="`/apps/${url}`"
    class="board-item"
  >
    <div
      class="color-dot"
      data-test="board-item-color"
      :style="{
        backgroundColor: `#${color}`
      }"
    />
    <div class="board-item-name-and-posts">
      <div data-test="board-item-name" class="board-item-name">
        {{ name }}
      </div>
      <div data-test="board-item-postcount" class="board-item-postcount">
        {{ postCount }}
      </div>
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
	postCount: {
		type: Number,
		default: 0
	}
})
</script>

<style lang='sass'>
.board-item
	flex: 1 1 0
	min-width: 250px
	display: flex
	align-items: center
	padding: 1rem 1.25rem
	background: rgba(255, 255, 255, 0.02)
	border: 1px solid var(--border-color)
	border-radius: 8px
	user-select: none
	transition: all 0.2s ease
	text-decoration: none

	&:hover
		background: rgba(255, 255, 255, 0.04)

.board-item-name-and-posts
	margin-left: 0.75rem
	display: flex
	justify-content: space-between
	align-items: center
	width: 100%

.board-item-name
	color: var(--color-text-primary)
	font-size: 13px
	font-weight: 400
	letter-spacing: 0.02em

.board-item-postcount
	color: var(--color-text-tertiary)
	font-size: 11px
	letter-spacing: 0.05em
	background: rgba(255, 255, 255, 0.05)
	padding: 0.125rem 0.5rem
	border-radius: 10px
</style>
