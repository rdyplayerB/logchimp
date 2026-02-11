<template>
  <div class="apps-layout">
    <div v-if="boards.length > 0" class="app-columns">
      <board-item
        v-for="board in boards"
        :key="board.boardId"
        :name="board.name"
        :color="board.color"
        :url="board.url"
        :post-count="Number(board.post_count)"
      />
    </div>

    <infinite-scroll @infinite="getBoards" :state="state">
      <template #no-results>
        <p>There are no apps.</p>
      </template>
    </infinite-scroll>
  </div>
</template>

<script lang="ts">
export default {
	name: "Boards"
}
</script>

<script setup lang="ts">
// packages
import { ref } from "vue";
import { useHead } from "@vueuse/head";

// modules
import { getPublicBoards } from "../../modules/boards";
import { useSettingStore } from "../../store/settings"

// components
import InfiniteScroll, { InfiniteScrollStateType } from "../../components/ui/InfiniteScroll.vue";
import BoardItem from "../../components/board/BoardItem.vue";

const { get: siteSettings } = useSettingStore()

// TODO: Add TS types
const boards = ref<any>([])
const page = ref<number>(1)
const state = ref<InfiniteScrollStateType>()

async function getBoards() {
	try {
		const response = await getPublicBoards({
      page: page.value,
      sort: "DESC"
    });

		if (response.data.boards.length) {
			boards.value.push(...response.data.boards);
			page.value += 1;
			state.value = "LOADED"
		} else {
			state.value = "COMPLETED";
		}
	} catch (error) {
		console.error(error);
		state.value = "ERROR"
	}
}

useHead({
	title: "apps | feedback | ビルド studio",
	meta: [
		{
			name: "og:title",
			content: "apps | feedback | ビルド studio"
		}
	]
})
</script>

<style lang='sass'>
.apps-layout
  display: flex
  flex-direction: column
  gap: 2rem
  margin-bottom: 4rem

.app-columns
  display: flex
  flex-wrap: wrap
  gap: 1.5rem
  padding-bottom: 1rem
  // Break out of container-view padding to align with header
  margin-left: calc(-3rem + 15px)
  margin-right: calc(-3rem + 15px)
</style>
