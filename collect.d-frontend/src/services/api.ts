import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh and auth errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await api.post('/auth/token/refresh/', {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('access_token', access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login/', { username, password });
        return response;
    },

    register: async (userData: { username: string; email: string; password: string }) => {
        const response = await api.post('/auth/register/', userData);
        return response;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me/');
        return response;
    },

    refreshToken: async (refresh: string) => {
        const response = await api.post('/auth/token/refresh/', { refresh });
        return response;
    },

    verifyToken: async (token: string) => {
        const response = await api.post('/auth/token/verify/', { token });
        return response;
    },
};

export const dataService = {
    getCustomers: async () => {
        const response = await api.get('/data/customers/');
        return response.data;
    },

    getInvoices: async () => {
        const response = await api.get('/data/invoices/');
        return response.data;
    },

    getPayments: async () => {
        const response = await api.get('/data/payments/');
        return response.data;
    },

    getCollectionCases: async () => {
        const response = await api.get('/data/collection-cases/');
        return response.data;
    },

    getDisputes: async () => {
        const response = await api.get('/data/disputes/');
        return response.data;
    },

    getRiskScores: async () => {
        const response = await api.get('/data/risk-scores/');
        return response.data;
    },

    getCustomerInteractions: async () => {
        const response = await api.get('/data/customer-interactions/');
        return response.data;
    },

    getOrders: async () => {
        const response = await api.get('/data/orders/');
        return response.data;
    },

    getGLEntries: async () => {
        const response = await api.get('/data/gl-entries/');
        return response.data;
    },

    getInvoiceLineItems: async () => {
        const response = await api.get('/data/invoice-line-items/');
        return response.data;
    },

    getPaymentPlans: async () => {
        const response = await api.get('/data/payment-plans/');
        return response.data;
    },

    getDSOAnalytics: async () => {
        const response = await api.get('/data/dso-analytics/');
        return response.data;
    },

    getStrategyEffectiveness: async () => {
        const response = await api.get('/data/strategy-effectiveness/');
        return response.data;
    },

    getCollectionPerformance: async () => {
        const response = await api.get('/data/collection-performance/');
        return response.data;
    },
};

export default api; 