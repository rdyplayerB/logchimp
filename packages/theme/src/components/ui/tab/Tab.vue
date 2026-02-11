<template>
  <div class="tab">
    <slot />
  </div>
</template>

<style lang='sass'>
.tab
	display: flex
	align-items: center
	border-bottom: 1px solid var(--border-color)
	margin-bottom: 1.25rem
	gap: 1.5rem
</style>
