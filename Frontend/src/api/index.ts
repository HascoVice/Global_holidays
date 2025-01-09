import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

api.get('/holidays').then((res) => {
    console.log(res.data);
});

api.get('/holidays/{country_code}').then((res) => {
    console.log(res.data);
});

api.get('/passengers').then((res) => {
    console.log(res.data);
});

api.get('/passengers/{country_code}').then((res) => {
    console.log(res.data);
});

export default api;
