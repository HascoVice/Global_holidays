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

export const fetchCountryHolidays = async (country_code: number) => {
    const response: AxiosResponse<Holiday> = await api.get(`/holidays/${country_code}`);
    return response.data;
};

export const fetchPassengers = async () => {
    const response: AxiosResponse<Holiday> = await api.get('/passengers');
    return response.data;
};

export const fetchCountryPassengers = async (country_code: number) => {
    const response: AxiosResponse<Holiday> = await api.get(`/passengers/${country_code}`);
    return response.data;
};

export default api;
