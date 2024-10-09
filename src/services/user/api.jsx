import axios from "axios";
import { store } from "../../utils/context/store";
import { BASE_URL } from "../../constants/baseUrls";
import { setAuthToken, logout } from "../../utils/context/reducers/authSlice"

// Create the main api instance
export const api = axios.create({
  withCredentials: true,
  baseURL: `${BASE_URL}/api`,
});

// Create a new instance for token refreshing to avoid interceptors interfering
const refreshApi = axios.create({
  withCredentials: true,
  baseURL: `${BASE_URL}/api`,
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    const response = await refreshApi.post("/token");
    const { accessToken } = response.data;
    const state = store.getState();
    // Update the store with the new token
    // store.dispatch({ type: "SET_AUTH_TOKEN", payload: accessToken }); //traditional approach where do everything manullay
    store.dispatch(setAuthToken({token: accessToken}))
    return accessToken;
  } catch (error) {
    // Handle refresh token failure (e.g., both tokens expired)
    // store.dispatch({ type: "LOGOUT" });
    store.dispatch(logout());
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const authToken = state.auth.token;
    config.headers["Authorization"] = `Bearer ${authToken}`;
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (assuming server returns 401)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh failed, logout and redirect to login page
        return Promisinterceptorse.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


// import axios from "axios";
// import {store} from "../../utils/context/store";
// import { BASE_URL } from "../../constants/baseUrls";

// export const api = axios.create({
//   withCredentials: true,
//   baseURL: `${BASE_URL}/api`,
// });

// api.interceptors.request.use(  
//   async (config) => {
//     const state = store.getState()
//     const authToken = state.auth.token
//     config.headers["Authorization"] = `Bearer ${authToken}`
//     return config;
//   },
//   async(error) => {
//     return Promise.reject(error)
//   }
// )