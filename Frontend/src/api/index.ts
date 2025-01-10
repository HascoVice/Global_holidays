import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Holiday from '@/types/Holiday';
import Passenger from '@/types/Passenger';

// Create an Axios instance with a base configuration
const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json', // Default content type for requests
    },
});

// Request interceptor to include token if available
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token'); // Retrieve token from localStorage
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         console.error('Error preparing the request:', error);
//         return Promise.reject(error);
//     }
// );

// Response interceptor to handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error during API response:', error);
        // Handle specific HTTP error statuses (401, 403, 404, etc.)
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized, please check your credentials.');
                    break;
                case 403:
                    console.error('Access forbidden.');
                    break;
                case 404:
                    console.error('Resource not found.');
                    break;
                default:
                    console.error('An error occurred, please try again.');
            }
        } else {
            console.error('Network error or server is unavailable.');
        }
        return Promise.reject(error);
    }
);

// Global error handler
const handleApiError = (error: unknown) => {
    console.error('API error detected:', error);
    return null; // Return a default value in case of failure
};

// Generic function to fetch data with error handling
const fetchData = async <T>(endpoint: string): Promise<T | null> => {
    try {
        const response: AxiosResponse<T> = await api.get(endpoint);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// Export specific functions

/**
 * Fetch all holidays.
 * @returns A list of holidays or null in case of an error.
 */
export const fetchHolidays = async (): Promise<Holiday[] | null> => {
    return fetchData<Holiday[]>('/holidays');
};

/**
 * Fetch holidays for a specific country.
 * @param countryCode Country code.
 * @returns A list of holidays or null in case of an error.
 */
export const fetchCountryHolidays = async (countryCode: number): Promise<Holiday[] | null> => {
    return fetchData<Holiday[]>(`/holidays/${countryCode}`);
};

/**
 * Fetch all passengers.
 * @returns A list of passengers or null in case of an error.
 */
export const fetchPassengers = async (): Promise<Passenger[] | null> => {
    return fetchData<Passenger[]>('/passengers');
};

/**
 * Fetch passengers for a specific country.
 * @param countryCode Country code.
 * @returns A list of passengers or null in case of an error.
 */
export const fetchCountryPassengers = async (countryCode: number): Promise<Passenger[] | null> => {
    return fetchData<Passenger[]>(`/passengers/${countryCode}`);
};

export default api;
