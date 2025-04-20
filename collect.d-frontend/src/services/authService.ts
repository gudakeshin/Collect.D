import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface LoginResponse {
    access: string;
    refresh: string;
    user: {
        email: string;
        name: string;
    };
}

export const authService = {
    async register(username: string, email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
                username,
                email,
                password
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Registration failed');
            }
            throw error;
        }
    },

    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
                username,
                password
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Login failed');
            }
            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                await axios.post(`${API_BASE_URL}/auth/logout/`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userData');
        }
    },

    async validateToken(token: string): Promise<boolean> {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/validate/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.valid;
        } catch (error) {
            return false;
        }
    }
}; 