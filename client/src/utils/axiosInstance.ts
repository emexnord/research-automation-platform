import axios from "axios";

// Axios Interceptor Instance
export const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // Set default headers for all requests
  },
});

// AxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     const accessToken = JSON.parse(token);

//     // If token is present, add it to request's Authorization Header
//     if (accessToken) {
//       if (config.headers) config.headers.token = accessToken;
//     }
//     return config;
//   },
//   (error) => {
//     // Handle request errors here
//     return Promise.reject(error);
//   }
// );

// AxiosInstance.interceptors.response.use(
//   (response) => {
//     // Can be modified response
//     return response;
//   },
//   (error) => {
//     // Handle response errors here
//     return Promise.reject(error);
//   }
// );
