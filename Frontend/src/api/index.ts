import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Holiday from '@/types/Holiday';
import Passenger from '@/types/Passenger';

const LIMIT = 1000;

// Create an Axios instance with a base configuration
const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export type ApiError = {
    status: number;
    message: string;
};

// Response interceptor to handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error during API response:', error);
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

/**
 * Global error handler for API requests
 * @param {unknown} error - The error thrown during the API request.
 * @returns {{ status: number; message: string } | null} - Returns an object with the error status and message.
 */
const handleApiError = (error: unknown): { status: number; message: string } | null => {
    console.error('API error detected:', error);

    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
            console.warn('No more data to fetch (404).');
            return { status: 404, message: 'No more data available' };
        }
        return { status: status || 500, message: error.message || 'API error occurred' };
    }
    return { status: 0, message: 'Network error or server is unavailable' };
};

/**
 * Generic function to fetch data from the API
 * @template T
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {Record<string, any>} params - The query parameters to pass to the request.
 * @returns {Promise<T | { status: number; message: string } | null>} - Returns the data or an error object.
 */
const fetchData = async <T>(
    endpoint: string,
    params: Record<string, any> = {}
): Promise<T | { status: number; message: string } | null> => {
    try {
        const response: AxiosResponse<T> = await api.get(endpoint, { params });
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * Fetch paginated holidays.
 * @param {number} [skip=0] - The number of items to skip.
 * @param {number} [limit=LIMIT] - The maximum number of items to fetch.
 * @returns {Promise<Holiday[] | { status: number; message: string } | null>} - Returns the holidays or an error object.
 */
export const fetchHolidays = async (
    skip: number = 0,
    limit: number = LIMIT
): Promise<Holiday[] | { status: number; message: string } | null> => {
    return fetchData<Holiday[]>('/holidays', { skip, limit });
};

/**
 * Fetch paginated holidays for a specific country.
 * @param {string} countryCode - The country code to fetch holidays for.
 * @param {number} [skip=0] - The number of items to skip.
 * @param {number} [limit=LIMIT] - The maximum number of items to fetch.
 * @returns {Promise<Holiday[] | { status: number; message: string } | null>} - Returns the holidays or an error object.
 */
export const fetchCountryHolidays = async (
    countryCode: string,
    skip: number = 0,
    limit: number = LIMIT
): Promise<Holiday[] | { status: number; message: string } | null> => {
    return fetchData<Holiday[]>(`/holidays/${countryCode}`, { skip, limit });
};

/**
 * Fetch paginated passengers.
 * @param {number} [skip=0] - The number of items to skip.
 * @param {number} [limit=LIMIT] - The maximum number of items to fetch.
 * @returns {Promise<Passenger[] | { status: number; message: string } | null>} - Returns the passengers or an error object.
 */
export const fetchPassengers = async (
    skip: number = 0,
    limit: number = LIMIT
): Promise<Passenger[] | { status: number; message: string } | null> => {
    return fetchData<Passenger[]>('/passengers', { skip, limit });
};

/**
 * Fetch paginated passengers for a specific country.
 * @param {string} countryCode - The country code to fetch passengers for.
 * @param {number} [skip=0] - The number of items to skip.
 * @param {number} [limit=LIMIT] - The maximum number of items to fetch.
 * @returns {Promise<Passenger[] | { status: number; message: string } | null>} - Returns the passengers or an error object.
 */
export const fetchCountryPassengers = async (
    countryCode: string,
    skip: number = 0,
    limit: number = LIMIT
): Promise<Passenger[] | { status: number; message: string } | null> => {
    return fetchData<Passenger[]>(`/passengers/${countryCode}`, { skip, limit });
};

export default api;
