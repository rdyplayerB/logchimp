<template>
  <header class="header">
    <div class="container">
      <div class="header-container">
        <a href="https://birudo.studio" class="back-link">
          ← home
        </a>
        <span class="separator">·</span>
        <span class="page-title">feedback</span>
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

.header-container
  display: flex
  align-items: center
  padding: 2rem 0

.back-link
  color: var(--color-text-tertiary)
  font-size: 13px
  font-weight: 400
  letter-spacing: 0.05em
  text-decoration: none
  transition: opacity 0.2s ease

  &:hover
    opacity: 0.7

.separator
  color: var(--color-text-tertiary)
  margin: 0 0.75rem
  opacity: 0.5

.page-title
  color: var(--color-text-primary)
  font-size: 13px
  font-weight: 400
  letter-spacing: 0.05em

// nav
.header-nav
  margin-left: auto

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
