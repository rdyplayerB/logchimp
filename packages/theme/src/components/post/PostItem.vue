<template>
  <div class="post">
    <vote
      :post-id="postData.postId"
      :votes-count="postData.voters.votesCount"
      :is-voted="isVoted"
      @update-voters="updateVoters"
    />
    <div>
      <router-link
        class="post-content-link"
        data-test="post-link"
        :to="`${dashboardUrl}/posts/${postData.slug}`"
      >
        <h5 class="post-content-title">
          {{ postData.title }}
        </h5>
      </router-link>
      <p
        v-if="postData.roadmap"
        class="post-roadmap"
        :style="{
          color: `#${postData.roadmap.color}`
        }"
      >
        {{ postData.roadmap.name }}
      </p>
      <p data-test="post-description" class="post-content-description">
        {{ useTrim(postData.contentMarkdown, 120) }}
      </p>
      <board-badge
        v-if="postData.board"
        :show-board="showBoard"
        :name="postData.board.name"
        :color="postData.board.color"
        :url="postData.board.url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, withDefaults } from "vue";

import { useTrim } from "../../hooks";

// components
import Vote, { VoteEventType } from "../vote/Vote.vue";
import BoardBadge from "../board/BoardBadge.vue";

interface Props {
  post: any
  dashboard?: boolean
  showBoard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dashboard: false,
  showBoard: true,
})

const postData = ref(props.post);
const dashboardUrl = computed(() => props.dashboard ? "/dashboard" : "");
const isVoted = computed<boolean>(() => Boolean(props.post.voters?.viewerVote?.voteId))

// TODO: Add TS types
function updateVoters(voters: VoteEventType) {
	postData.value.voters.votesCount = voters.votesCount;
	postData.value.voters.viewerVote = voters.viewerVote;
}
</script>

<style lang='sass'>
.post
	display: flex
	align-items: flex-start
	margin-bottom: 1.25rem

	&:last-child
		margin-bottom: 0

.post-content-link
	text-decoration: none

.post-content-title
	color: var(--color-text-primary)
	font-size: 14px
	font-weight: 400
	letter-spacing: 0.02em
	margin-bottom: 0
	transition: opacity 0.15s ease

	&:hover
		opacity: 0.7

.post-roadmap
	text-transform: lowercase
	font-weight: 400
	font-size: 12px
	margin-top: 0.25rem
	letter-spacing: 0.05em

.post-content-description
	margin-top: 0.5rem
	color: var(--color-text-secondary)
	font-size: 13px
	letter-spacing: 0.02em
	margin-bottom: 0.625rem
	line-height: 1.6

.post-date
	color: var(--color-text-tertiary)
	font-size: 12px
	letter-spacing: 0.05em
</style>
