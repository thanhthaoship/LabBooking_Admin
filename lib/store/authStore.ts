import { create } from 'zustand';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import apiService from '@/lib/api/core';
import { User } from '@/lib/api/services/fetchUser';
import { getAuthCookieConfig } from '@/lib/utils/cookieConfig';
import { decodeJWT } from '@/lib/utils/decode-jwt';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  syncAuthState: () => void;
  syncUserFromProfile: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setToken: (token: string | null) => {
    if (token) {
      setCookie('auth-token', token, getAuthCookieConfig());
      apiService.setAuthToken(token);
    } else {
      // Use same config for deletion as for setting
      const cookieConfig = getAuthCookieConfig();
      deleteCookie('auth-token', {
        path: cookieConfig.path,
        domain: cookieConfig.domain,
        secure: cookieConfig.secure,
      });
      apiService.setAuthToken(null);
    }

    set({ token, isAuthenticated: !!token });
  },

  setUser: (user: User | null) => {
    // In-memory only; no user cookie persistence
    if (user) {
      const state = useAuthStore.getState();
      const userWithId = { ...user };
      if (state.token) {
        const decodedToken = decodeJWT(state.token);
        if (decodedToken && decodedToken.UserID) {
          userWithId.id = decodedToken.UserID;
        }
      }
      set({ user: userWithId });
    } else {
      set({ user });
    }
  },

  login: (token: string, user: User) => {
    // Persist token immediately and set API header
    setCookie('auth-token', token, getAuthCookieConfig());
    apiService.setAuthToken(token);

    // Build a minimal user from the token synchronously to avoid UI delay
    const decoded = decodeJWT(token);
    let baseUser: User | null = null;
    if (decoded && decoded.UserID) {
      baseUser = {
        id: decoded.UserID,
        userName: decoded.unique_name || decoded.UserID,
        fullName: decoded.FullName || decoded.unique_name || 'User',
        email: '',
        phoneNumber: '',
        avatar: '',
        status: decoded.Status || 'Online',
        role: decoded.role || 'User',
        about: '',
        birthdate: '',
        joinedAt: decoded.JoinedAt || '',
      } as User;
    }

    const mergedUser: User | null = user
      ? ({ ...(baseUser || ({} as User)), ...user, id: decoded?.UserID || user.id } as User)
      : baseUser;

    set({
      token,
      user: mergedUser || null,
      isAuthenticated: true,
    });
  },

  logout: () => {
    // Use same config for deletion as for setting
    const cookieConfig = getAuthCookieConfig();
    deleteCookie('auth-token', {
      path: cookieConfig.path,
      domain: cookieConfig.domain,
      secure: cookieConfig.secure,
    });
    deleteCookie('auth-user', {
      path: cookieConfig.path,
      domain: cookieConfig.domain,
      secure: cookieConfig.secure,
    });
    apiService.setAuthToken(null);

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  syncAuthState: () => {
    if (typeof window !== 'undefined') {
      const cookieToken = getCookie('auth-token');

      set(state => {
        const storeHasToken = !!state.token;
        const cookieHasToken = !!cookieToken;

        if (storeHasToken !== cookieHasToken) {
          if (cookieHasToken) {
            // Set the API token immediately when syncing from cookie
            apiService.setAuthToken(cookieToken as string);

            // Build minimal user from token
            let userData = null;
            const decoded = decodeJWT(cookieToken as string);
            if (decoded && decoded.UserID) {
              userData = {
                id: decoded.UserID,
                userName: decoded.unique_name || decoded.UserID,
                fullName: decoded.FullName || decoded.unique_name || 'User',
                email: '',
                phoneNumber: '',
                avatar: '',
                status: decoded.Status || 'Online',
                role: decoded.role || 'User',
                about: '',
                birthdate: '',
                joinedAt: decoded.JoinedAt || '',
              } as User;
            }

            return {
              token: cookieToken as string,
              user: userData,
              isAuthenticated: true,
            };
          } else {
            // Clear API token when no cookie
            apiService.setAuthToken(null);
            return {
              token: null,
              user: null,
              isAuthenticated: false,
            };
          }
        }

        // Ensure API service has the token even if store state doesn't change
        if (storeHasToken && state.token) {
          apiService.setAuthToken(state.token);
        }

        // Also ensure user data is restored if missing
        if (storeHasToken && !state.user && state.token) {
          try {
            let userData: User | null = null;
            const decoded = decodeJWT(state.token);
            if (decoded && decoded.UserID) {
              userData = {
                id: decoded.UserID,
                userName: decoded.unique_name || decoded.UserID,
                fullName: decoded.FullName || decoded.unique_name || 'User',
                email: '',
                phoneNumber: '',
                avatar: '',
                status: decoded.Status || 'Online',
                role: decoded.role || 'User',
                about: '',
                birthdate: '',
                joinedAt: decoded.JoinedAt || '',
              } as User;
            }
            return {
              ...state,
              user: userData,
            };
          } catch (error) {
            console.error('🔄 [AUTH SYNC] Failed to parse user data:', error);
          }
        }

        return {
          isAuthenticated: storeHasToken,
        };
      });
    }
  },

  syncUserFromProfile: (user: User) => {
    if (typeof window !== 'undefined') {
      // Get current token and decode it to extract UserID
      const state = useAuthStore.getState();
      const userWithId = { ...user };

      if (state.token) {
        const decodedToken = decodeJWT(state.token);
        if (decodedToken && decodedToken.UserID) {
          userWithId.id = decodedToken.UserID;
        }
      }

      // Store user data in cookie
      setCookie('auth-user', JSON.stringify(userWithId), getAuthCookieConfig());
      // Update store
      set({ user: userWithId });
    }
  },
}));

// Initialize auth state from storage with better SSR handling
const initializeAuth = () => {
  if (typeof window !== 'undefined') {
    const state = useAuthStore.getState();
    const cookieToken = getCookie('auth-token');

    // Primary logic: Cookie is the source of truth
    if (cookieToken) {
      // Cookie exists - ensure store is in sync
      if (!state.token || state.token !== cookieToken) {
        apiService.setAuthToken(cookieToken as string);
        state.setToken(cookieToken as string);
      } else {
        // Store already has correct token, just ensure API service has it
        apiService.setAuthToken(cookieToken as string);
      }

      // If user missing, derive from token
      if (!state.user) {
        const decoded = decodeJWT(cookieToken as string);
        if (decoded && decoded.UserID) {
          const userData = {
            id: decoded.UserID,
            userName: decoded.unique_name || decoded.UserID,
            fullName: decoded.FullName || decoded.unique_name || 'User',
            email: '',
            phoneNumber: '',
            avatar: '',
            status: decoded.Status || 'Online',
            role: decoded.role || 'User',
            about: '',
            birthdate: '',
            joinedAt: decoded.JoinedAt || '',
          } as User;
          state.setUser(userData);
        }
      } else if (state.user) {
        console.warn('🔧 [AUTH INIT] User data already exists in store');
      }
    } else {
      // No cookie - clear everything
      console.warn('🔧 [AUTH INIT] No token cookie, clearing auth state');
      if (state.token || state.isAuthenticated) {
        state.logout();
      }
    }

    // Force sync auth state to ensure everything is properly restored
    state.syncAuthState();

    // Listen for logout events from API service
    const handleLogout = () => {
      state.logout();
    };

    window.addEventListener('logout', handleLogout);

    // Cleanup listener on page unload
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('logout', handleLogout);
    });
  }
};

// Use multiple initialization strategies for better reliability
if (typeof window !== 'undefined') {
  // Immediate initialization for client-side
  if (document.readyState === 'complete') {
    initializeAuth();
  } else {
    // Wait for DOM ready
    document.addEventListener('DOMContentLoaded', initializeAuth);
    // Also use setTimeout as fallback
    setTimeout(initializeAuth, 0);
  }
}