import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 404) {
			return Promise.reject(new Error('NOT_FOUND'));
		}
		console.error('API Error:', error.message);
		return Promise.reject(error);
	}
);

export default api;
