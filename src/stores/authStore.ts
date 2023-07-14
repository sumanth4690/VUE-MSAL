import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { AccountInfo } from '@azure/msal-browser'

export const useAuthStore = defineStore('authStore', () => {
  const account = ref<AccountInfo | null>() 
  return { account}
})
