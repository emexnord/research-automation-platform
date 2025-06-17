import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // if you're using cookies/auth sessions
});

export default api;
