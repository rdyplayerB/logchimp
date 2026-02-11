<template>
  <div :class="$style.root">
    <div :class="$style.loader" />
  </div>
</template>

<script setup lang="ts">

</script>

<style lang='scss' module>
.root {
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: var(--bg-primary);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-text-tertiary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
