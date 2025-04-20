import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network Error:', error.request);
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export default apiClient; 