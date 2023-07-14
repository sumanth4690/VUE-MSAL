import type { Configuration } from '@azure/msal-browser'
import type { AccountInfo, AuthenticationResult, SilentRequest } from '@azure/msal-browser'
import {
  BrowserCacheLocation,
  InteractionRequiredAuthError,
   PublicClientApplication
} from '@azure/msal-browser'
import axios from 'axios'

export const scopes = ['User.Read']

export const config: Configuration = {
  // required
  auth: {
    // must match info in dashboard
    clientId: "client Id",
    authority: "https://login.microsoftonline.com/tenent id",
    // login redirect; must match path in dashboard
    redirectUri: window.location.origin,
  },
cache:{
  cacheLocation: BrowserCacheLocation.SessionStorage
}
}

// type
export type MaybeAccount = AccountInfo | null

/**
 * MSAL instance
 */
export const msal = new PublicClientApplication(config)

/**
 * Auth service
 */
export const Auth = {
  /**
   * Get token for api and attaching in interceptors
   */
  async getToken () {
    const request: SilentRequest = {
      scopes
    }
    return msal
      // try getting the token silently
      .acquireTokenSilent(request)

      // attempt login popup if this fails
      .catch(async (error: unknown) => {
        if (error instanceof InteractionRequiredAuthError) {
          return msal.acquireTokenPopup(request)
        }
        throw error
      })
      .then((result: AuthenticationResult) => {
        registerAuthorizationHeaderInterceptor(result)
        return result.accessToken
      })
  }
}
const registerAuthorizationHeaderInterceptor = (res: AuthenticationResult) => {
  axios.interceptors.request.use((config) => {
    if (res.accessToken) {
      config.headers.Authorization = `Bearer ${res.accessToken}`;
    }

    return Promise.resolve(config);
  });
};
