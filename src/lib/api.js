import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let getAccessToken = () => null;

let refreshAccessToken = null;
let handleAuthFailure = () => {};
let refreshPromise = null;
export const setAccessTokenGetter = (getter) => {
  getAccessToken = getter;
};

export const setRefreshAccessToken = (functionRef) => {
  refreshAccessToken = functionRef;
};

// Attach access token to normal requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 responses
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh the refresh request itself
    if (originalRequest.url === "/auth/refresh") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      handleAuthFailure();

      return Promise.reject(refreshError);
    }
  },
);

export const setAuthFailureHandler = (handler) => {
  handleAuthFailure = handler;
};

export default api;
