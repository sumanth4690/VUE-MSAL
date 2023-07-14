<template>
  <div v-if="authStore.account">
    <div class="card w-25">
      <h5 class="card-header">Current Account</h5>
      <div class="card-body">
        <h3 class="card-title">{{ authStore.account.name }}</h3>
        <p class="card-text">Email: {{ authStore.account.username }}</p>
        <button class="btn btn-danger" @click="logout(currentUser)">Log out</button>
      </div>
    </div>
  </div>
  <div v-else>
    <button @click="msal.loginRedirect(request)" class="btn btn-primary">LOGIN</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import type { AccountInfo, RedirectRequest } from "@azure/msal-browser"
import { msal, scopes } from "@/config/auth"
import { useAuthStore } from "@/stores/authStore"
import { Auth } from "@/config/auth"

const authStore = useAuthStore()
const request: RedirectRequest = {
  redirectUri: window.location.origin,
  scopes: scopes
}
const currentUser = ref<AccountInfo | undefined>()

onMounted(async () => {
  await msal.handleRedirectPromise().then(async (res) => {
    if (res?.account) {
      const allAccounts = msal.getAllAccounts()
      authStore.account = res?.account
      currentUser.value = res.account
      msal.setActiveAccount(allAccounts[0])
      await Auth.getToken()
    }
  })
})
function logout(account: AccountInfo | undefined) {
  msal.logoutRedirect({
    // required to make the application return to the home page
    account: account,
    postLogoutRedirectUri: "/"
  })
}
</script>
