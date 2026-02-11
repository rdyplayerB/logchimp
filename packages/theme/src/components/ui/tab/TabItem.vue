<template>
  <div class="tab-item" @click="$emit('click')">
    <div class="tab-item-icon">
      <slot name="icon" />
    </div>
    <h6 class="tab-item-content">
      <slot />
    </h6>
  </div>
</template>

<style lang='sass'>
.tab-item
	padding: 0.75rem 0
	display: flex
	align-items: center
	border-bottom: 1px solid transparent
	margin-bottom: -1px
	cursor: pointer
	transition: all 0.2s ease

.tab-item-icon
	display: flex
	margin-right: 0.5rem

	svg
		stroke: var(--color-text-tertiary)
		width: 1rem
		height: 1rem

.tab-item-content
	color: var(--color-text-tertiary)
	font-size: 13px
	font-weight: 400
	letter-spacing: 0.05em
	margin-bottom: 0
	text-transform: lowercase

.tab-item:hover
	opacity: 0.7

.tab-item-active
	border-color: var(--color-text-primary)

	.tab-item-icon svg
		stroke: var(--color-text-primary)

	.tab-item-content
		color: var(--color-text-primary)
</style>
