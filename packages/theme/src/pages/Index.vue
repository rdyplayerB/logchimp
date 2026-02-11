<template>
  <div class="flex flex-col-reverse lg:flex-row mb-16 lg:space-x-8">
    <main class="grow-[2] shrink basis-0">
      <div v-if="Object.keys(groupedPosts).length > 0" class="posts-grouped">
        <div
          v-for="(group, boardId) in groupedPosts"
          :key="boardId"
          class="app-section"
        >
          <router-link
            v-if="group.board"
            :to="`/apps/${group.board.url}`"
            class="app-section-header"
          >
            <div
              class="app-section-dot"
              :style="{ backgroundColor: `#${group.board.color}` }"
            />
            <span class="app-section-name">{{ group.board.name }}</span>
            <span class="app-section-count">{{ group.posts.length }}</span>
          </router-link>
          <div class="app-section-posts">
            <post-item
              v-for="post in group.posts"
              :key="post.postId"
              :post="post"
              :show-board="false"
            />
          </div>
        </div>
      </div>

      <infinite-scroll @infinite="getBoardPosts" :state="state" />
    </main>
    <aside class="flex-1 mb-6 lg:mb-0">
      <site-setup-card v-if="showSiteSetupCard" />
      <login-card v-if="!userStore.getUserId && !showSiteSetupCard" />
    </aside>
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
import { useSettingStore } from "../store/settings"
import { useUserStore } from "../store/user"

// components
import InfiniteScroll, { InfiniteScrollStateType } from "../components/ui/InfiniteScroll.vue";
import PostItem from "../components/post/PostItem.vue";
import SiteSetupCard from "../components/site/SiteSetupCard.vue";
import LoginCard from "../components/auth/LoginCard.vue";

const settingsStore = useSettingStore()
const userStore = useUserStore()

// TODO: Add TS type
const posts = ref<any>([]);
const page = ref<number>(1);
const showSiteSetupCard = ref<boolean>(false)
const state = ref<InfiniteScrollStateType>()

// Group posts by their board/app
const groupedPosts = computed(() => {
  const groups: Record<string, { board: any; posts: any[] }> = {};

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

onMounted(() => isSetup());

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
.posts-grouped
  display: flex
  flex-direction: column
  gap: 2.5rem

.app-section
  display: flex
  flex-direction: column

.app-section-header
  display: inline-flex
  align-items: center
  gap: 0.5rem
  padding-bottom: 1rem
  margin-bottom: 1rem
  border-bottom: 1px solid var(--border-color)
  text-decoration: none
  transition: opacity 0.2s ease

  &:hover
    opacity: 0.7

.app-section-dot
  width: 8px
  height: 8px
  border-radius: 50%
  flex-shrink: 0

.app-section-name
  color: var(--color-text-primary)
  font-size: 14px
  font-weight: 400
  letter-spacing: 0.02em

.app-section-count
  color: var(--color-text-tertiary)
  font-size: 11px
  letter-spacing: 0.05em
  margin-left: 0.25rem

.app-section-posts
  display: flex
  flex-direction: column
</style>
