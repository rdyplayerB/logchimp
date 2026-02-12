<template>
  <header class="header">
    <div class="container">
      <div class="header-top">
        <router-link to="/" class="brand">
          <span class="brand-kanji">ビルド</span>
          <span class="brand-text">studio</span>
        </router-link>
        <nav class="header-nav">
          <div v-if="userStore.user.userId" class="nav-links">
            <router-link v-if="accessDashboard" to="/dashboard" class="nav-link">
              dashboard
            </router-link>
            <router-link to="/settings" class="nav-link">
              settings
            </router-link>
            <a href="#" class="nav-link" @click.prevent="userStore.logout">
              sign out
            </a>
          </div>
          <div v-else class="nav-links">
            <router-link to="/login" class="nav-link">
              login
            </router-link>
            <router-link v-if="settingsStore.get.allowSignup" to="/join" class="nav-link">
              join
            </router-link>
          </div>
        </nav>
      </div>
      <div class="header-divider"></div>
      <navbar />
    </div>
  </header>
</template>

<script setup lang="ts">
// packages
import { computed } from "vue";

import { useSettingStore } from "../store/settings"
import { useUserStore } from "../store/user"

// components
import Navbar from "./Navbar.vue";

const settingsStore = useSettingStore()
const userStore = useUserStore()

const accessDashboard = computed(() => {
	return userStore.permissions.includes("dashboard:read");
})
</script>

<style lang='sass'>
.header
  background-color: transparent

.header-top
  display: flex
  align-items: center
  justify-content: space-between
  padding-top: 2rem
  padding-bottom: 1.5rem

.header-divider
  height: 1px
  background: linear-gradient(90deg, transparent, var(--border-color) 20%, var(--border-color) 80%, transparent)

.brand
  display: flex
  align-items: baseline
  gap: 0.5rem
  text-decoration: none
  transition: opacity 0.2s ease

  &:hover
    opacity: 0.7

.brand-kanji
  color: var(--color-text-primary)
  font-size: 1.25rem
  font-weight: 400
  letter-spacing: 0.02em

.brand-text
  color: var(--color-text-tertiary)
  font-size: 13px
  font-weight: 400
  letter-spacing: 0.1em
  text-transform: lowercase

// nav
.header-nav
  display: flex

.nav-links
  display: flex
  align-items: center
  gap: 2rem

.nav-link
  color: var(--color-text-tertiary)
  font-size: 13px
  font-weight: 400
  letter-spacing: 0.05em
  text-decoration: none
  transition: opacity 0.2s ease

  &:hover
    opacity: 0.7
</style>
