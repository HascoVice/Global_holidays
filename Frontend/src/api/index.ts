import axios, { AxiosResponse } from 'axios';
import Holiday from '@/types/Holiday.ts';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export const fetchHolidays = async () => {
    const response: AxiosResponse<Holiday> = await api.get('/holidays');
    return response.data;
};

export const fetchCountryHolidays = api.get('/holidays/{country_code}').then((res) => {
    console.log(res.data);
});

export const fetchPassengers = api.get('/passengers').then((res) => {
    console.log(res.data);
});

export const fetchCountryPassengers = api.get('/passengers/{country_code}').then((res) => {
    console.log(res.data);
});

export default api;
