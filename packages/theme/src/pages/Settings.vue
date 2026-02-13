<template>
  <div>
    <h4 class="form-header">
      Account settings
    </h4>
    <div v-if="!loading">
      <server-error v-if="serverError" @close="serverError = false" />

      <alert
        v-if="!isVerified"
        title="Email verification"
        description="We’ve sent you an verification email. Please follow the instructions in the email."
        type="warning"
        :class="$style.verification"
      >
        <template #cta>
          <Button
            type="primary"
            :loading="resendVerificationEmailButtonLoading"
            @click="resendEmail"
          >
            Resend
          </Button>
        </template>
      </alert>

      <l-text
        v-model="name.value"
        label="Name"
        type="text"
        name="Name"
        placeholder="Full name"
        class="user-settings-name-item"
        @keyup-enter="updateSettings"
        @hide-error="hideNameError"
        :error="name.error"
      />
      <l-text
        v-model="user.username"
        label="Username"
        type="text"
        name="Username"
        placeholder="Username"
        :disabled="true"
      />
      <l-text
        v-model="user.email"
        label="Email Address"
        type="text"
        name="Email Address"
        placeholder="Email address"
        :disabled="true"
      />

      <h5 class="form-subheader">Email notifications</h5>
      <toggle-item
        v-model="emailOnComment"
        label="Comments on my posts"
        note="Receive an email when someone comments on your feedback"
      />

      <div class="settings-actions">
        <Button
          type="primary"
          :loading="updateUserButtonLoading"
          @click="updateSettings"
        >
          Update
        </Button>
        <transition name="fade">
          <span v-if="showSaved" class="saved-message">Changes saved</span>
        </transition>
      </div>
    </div>
    <div v-else class="loader-container">
      <loader />
    </div>
  </div>
</template>

<script lang="ts">
export default {
	name: "UserSettings",
}
</script>

<script setup lang="ts">
// packages
import { onMounted, reactive, ref } from "vue";
import { useHead } from "@vueuse/head";

// modules
import { router } from "../router";
import { getUserSettings, updateUserSettings } from "../modules/users";
import { resendUserVerificationEmail } from "../modules/auth";
import { useSettingStore } from "../store/settings"
import { useUserStore } from "../store/user"
import tokenError from "../utils/tokenError";

// components
import { Alert } from "../components/ui/Alert";
import Loader from "../components/ui/Loader.vue";
import ServerError from "../components/serverError.vue";
import LText from "../components/ui/input/LText.vue";
import Button from "../components/ui/Button.vue";
import ToggleItem from "../components/ui/input/ToggleItem.vue";
import { FormFieldErrorType } from "../components/ui/input/formBaseProps";

const { get: siteSettings } = useSettingStore()
const { getUserId } = useUserStore()

const user = reactive({
	username: "",
	email: "",
});

const name = reactive({
  value: "",
  error: {
    show: false,
    message: ""
  }
})

const loading = ref<boolean>(false);
const isVerified = ref<boolean>(false);
const serverError = ref<boolean>(false);
const resendVerificationEmailButtonLoading = ref<boolean>(false);
const updateUserButtonLoading = ref<boolean>(false);
const showSaved = ref<boolean>(false);
const emailOnComment = ref<boolean>(true);

async function getUser() {
	loading.value = true;

	try {
		const response = await getUserSettings();

		name.value = response.data.user.name;
		user.username = response.data.user.username;
		user.email = response.data.user.email;
		isVerified.value = response.data.user.isVerified;
		emailOnComment.value = response.data.user.notificationPreferences?.emailOnComment ?? true;
	} catch (error) {
		tokenError(error);
	} finally {
		loading.value = false;
	}
}

async function updateSettings() {
	updateUserButtonLoading.value = true;

	try {
		const response = await updateUserSettings({
			name: name.value,
			notificationPreferences: {
				emailOnComment: emailOnComment.value,
			},
		});

		name.value = response.data.user.name;
		emailOnComment.value = response.data.user.notificationPreferences?.emailOnComment ?? true;
		updateUserButtonLoading.value = false;

		// Show success message
		showSaved.value = true;
		setTimeout(() => {
			showSaved.value = false;
		}, 2500);
    // TODO: Add TS types
    // biome-ignore lint: Add TS types
	} catch (error: any) {
		updateUserButtonLoading.value = false;

    Object.assign(name.error, {
      message: error.response.data.name,
      show: true,
    })
	}
}

async function resendEmail() {
	resendVerificationEmailButtonLoading.value = true;

	try {
		const email = user.email;
		await resendUserVerificationEmail(email);
	} catch (error: any) {
		if (error.response.data.code === "MAIL_CONFIG_MISSING") {
			serverError.value = true;
		}

		console.error(error);
	} finally {
		resendVerificationEmailButtonLoading.value = false;
	}
}

function hideNameError(value: FormFieldErrorType) {
  Object.assign(name.error, value)
}

onMounted(() => {
	if (getUserId) {
		getUser();
	} else {
		router.push({
			path: "/login",
			query: {
				redirect: "/settings"
			}
		});
	}
})

useHead({
	title: "User settings",
	meta: [
		{
			name: "og:title",
			content: () => `User settings • ${siteSettings.title}`
		}
	]
})
</script>

<style lang='scss' module>
.verification {
	margin-bottom: 2rem;
}
</style>

<style lang='scss' scoped>
.form-subheader {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.settings-actions {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.saved-message {
  color: #22c55e;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
