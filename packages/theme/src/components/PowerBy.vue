<template>
	<div class="logchimp-poweredby">
		<a
			:href="
				`https://logchimp.codecarrot.net/?utm_source=${source}&utm_medium=powered&company=${siteSettings.title}`
			"
		>
			Powered by LogChimp
		</a>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router"

import { useSettingStore } from "../store/settings"

const route = useRoute();
const { get: siteSettings } = useSettingStore()

const source = computed(() => route.name?.toString())
</script>

<style lang='sass'>
.logchimp-poweredby
	display: flex
	justify-content: center
	margin-top: 3rem
	padding-bottom: 2rem

	a
		font-size: 10px
		letter-spacing: 0.1em
		color: var(--color-text-tertiary)
		opacity: 0.4
		text-decoration: none
		text-transform: lowercase
		transition: opacity 0.2s ease

		&:hover
			opacity: 0.6
</style>
