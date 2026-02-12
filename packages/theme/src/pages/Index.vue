<template>
  <div class="home-layout">
    <!-- Show site setup card for initial setup only -->
    <aside v-if="showSiteSetupCard" class="home-aside">
      <site-setup-card />
    </aside>

    <!-- Main content: app columns spanning full width -->
    <div v-if="Object.keys(groupedPosts).length > 0" class="app-columns">
      <div
        v-for="(group, boardId) in groupedPosts"
        :key="boardId"
        class="app-column"
      >
        <router-link
          v-if="group.board"
          :to="`/apps/${group.board.url}`"
          class="app-column-header"
        >
          <div class="app-column-header-left">
            <div
              class="app-column-dot"
              :style="{ backgroundColor: `#${group.board.color}` }"
            />
            <span class="app-column-name">{{ group.board.name }}</span>
          </div>
          <span class="app-column-count">{{ group.posts.length }}</span>
        </router-link>
        <div class="app-column-posts">
          <post-item
            v-for="post in group.posts"
            :key="post.postId"
            :post="post"
            :show-board="false"
          />
          <div v-if="group.posts.length === 0" class="app-column-empty">
            No feedback yet
          </div>
        </div>
      </div>
    </div>

    <infinite-scroll @infinite="getBoardPosts" :state="state" />
  </div>
</template>

<script lang="ts">
export default {
	name: "Homepage"
}
</script>

<script setup lang="ts">
// packages
import { computed, onMounted, ref } from "vue";
import { useHead } from "@vueuse/head";

// modules
import { isSiteSetup } from "../modules/site";
import { getPosts } from "../modules/posts";
import { getPublicBoards, Board } from "../modules/boards";
import { useSettingStore } from "../store/settings"

// components
import InfiniteScroll, { InfiniteScrollStateType } from "../components/ui/InfiniteScroll.vue";
import PostItem from "../components/post/PostItem.vue";
import SiteSetupCard from "../components/site/SiteSetupCard.vue";

const settingsStore = useSettingStore()

// TODO: Add TS type
const posts = ref<any>([]);
const boards = ref<Board[]>([]);
const page = ref<number>(1);
const showSiteSetupCard = ref<boolean>(false)
const state = ref<InfiniteScrollStateType>()

// Group posts by their board/app, including boards with no posts
const groupedPosts = computed(() => {
  const groups: Record<string, { board: any; posts: any[] }> = {};

  // First, add all boards (even if they have no posts)
  for (const board of boards.value) {
    const boardId = board.boardId || board.url;
    groups[boardId] = {
      board: board,
      posts: []
    };
  }

  // Then, add posts to their respective boards
  for (const post of posts.value) {
    if (post.board) {
      const boardId = post.board.boardId || post.board.url;
      if (!groups[boardId]) {
        groups[boardId] = {
          board: post.board,
          posts: []
        };
      }
      groups[boardId].posts.push(post);
    }
  }

  return groups;
});

async function isSetup() {
	try {
		const response = await isSiteSetup();
		showSiteSetupCard.value = !response.data.is_setup;
	} catch (error) {
		console.error(error);
	}
}

async function fetchBoards() {
  try {
    const response = await getPublicBoards({ page: 1, sort: "DESC" });
    boards.value = response.data.boards || [];
  } catch (error) {
    console.error(error);
  }
}

async function getBoardPosts() {
  state.value = 'LOADING'

  try {
    const response = await getPosts({
			page: page.value,
			sort: "DESC"
		});

    if (response.data.posts.length) {
      posts.value.push(...response.data.posts);
      page.value += 1;
      state.value = 'LOADED'
    } else {
      state.value = 'COMPLETED'
    }
  } catch (error) {
    console.error(error);
    state.value = 'ERROR'
  }
}

onMounted(() => {
  isSetup();
  fetchBoards();
});

useHead({
	title: "feedback | ビルド studio",
	meta: [
		{
			name: "og:title",
			content: "feedback | ビルド studio"
		}
	]
})
</script>

<style lang='sass'>
.home-layout
  display: flex
  flex-direction: column
  gap: 2rem
  margin-bottom: 4rem

.home-aside
  max-width: 320px
  margin-bottom: 1rem

.app-columns
  display: flex
  gap: 1.5rem
  padding-bottom: 1rem
  // Break out of container-view padding to align with header
  margin-left: calc(-3rem + 15px)
  margin-right: calc(-3rem + 15px)

.app-column
  flex: 1 1 0
  min-width: 250px
  display: flex
  flex-direction: column
  background: rgba(255, 255, 255, 0.02)
  border: 1px solid var(--border-color)
  border-radius: 8px
  overflow: hidden

.app-column-header
  display: flex
  align-items: center
  justify-content: space-between
  padding: 1rem 1.25rem
  background: rgba(255, 255, 255, 0.02)
  border-bottom: 1px solid var(--border-color)
  text-decoration: none
  transition: background 0.2s ease

  &:hover
    background: rgba(255, 255, 255, 0.04)

.app-column-header-left
  display: flex
  align-items: center
  gap: 0.5rem

.app-column-dot
  width: 8px
  height: 8px
  border-radius: 50%
  flex-shrink: 0

.app-column-name
  color: var(--color-text-primary)
  font-size: 13px
  font-weight: 400
  letter-spacing: 0.02em

.app-column-count
  color: var(--color-text-tertiary)
  font-size: 11px
  letter-spacing: 0.05em
  background: rgba(255, 255, 255, 0.05)
  padding: 0.125rem 0.5rem
  border-radius: 10px

.app-column-posts
  display: flex
  flex-direction: column
  padding: 1rem
  gap: 0.5rem
  max-height: 500px
  overflow-y: auto

  // Subtle scrollbar
  scrollbar-width: thin
  scrollbar-color: var(--border-color) transparent

  &::-webkit-scrollbar
    width: 4px

  &::-webkit-scrollbar-track
    background: transparent

  &::-webkit-scrollbar-thumb
    background: var(--border-color)
    border-radius: 2px

  .post
    margin-bottom: 0.75rem
    padding-bottom: 0.75rem
    border-bottom: 1px solid var(--border-color-subtle)

    &:last-child
      margin-bottom: 0
      padding-bottom: 0
      border-bottom: none

.app-column-empty
  color: var(--color-text-tertiary)
  font-size: 12px
  text-align: center
  padding: 2rem 1rem
  font-style: italic
</style>
