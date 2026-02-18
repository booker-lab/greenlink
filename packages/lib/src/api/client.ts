
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API Client
export abstract class ApiClient {
    protected instance: AxiosInstance;

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            ...config,
        });

        this.initializeInterceptors();
    }

    private initializeInterceptors() {
        this.instance.interceptors.request.use(
            (config) => {
                // Add auth token if available (implementation dependent)
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle global errors (e.g. 401 Unauthorized)
                if (error.response?.status === 401) {
                    console.warn('Unauthorized access. Redirecting to login...');
                    // redirect logic or event emission
                }
                return Promise.reject(error);
            }
        );
    }

    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.get(url, config);
        return response.data;
    }

    protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.post(url, data, config);
        return response.data;
    }

    protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.put(url, data, config);
        return response.data;
    }

    protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.instance.delete(url, config);
        return response.data;
    }
}
