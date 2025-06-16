import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000', // change this to your backend base URL
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // if you're using cookies/auth sessions
});

export default api;
