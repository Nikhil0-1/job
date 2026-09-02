import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jp_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('jp_token');
      localStorage.removeItem('jp_user');
      // Only redirect if on an employer protected route
      if (window.location.pathname.startsWith('/employer/') &&
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')) {
        window.location.href = '/employer/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API service helpers
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const jobsAPI = {
  getPublicJobs: (params?: any) => api.get('/jobs', { params }),
  getJobById: (id: string) => api.get(`/jobs/${id}`),
  getEmployerJobs: (params?: any) => api.get('/jobs/employer/my-jobs', { params }),
  createJob: (data: any) => api.post('/jobs', data),
  updateJob: (id: string, data: any) => api.patch(`/jobs/${id}`, data),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),
  updateJobStatus: (id: string, status: string) => api.patch(`/jobs/${id}/status`, { status }),
  getJobApplications: (id: string) => api.get(`/jobs/${id}/applications`),
};

export const companyAPI = {
  getMyCompany: () => api.get('/companies/employer/profile'),
  getCompanyById: (id: string) => api.get(`/companies/${id}`),
  createOrUpdateCompany: (data: any) => api.post('/companies', data),
  updateCompany: (id: string, data: any) => api.patch(`/companies/${id}`, data),
  uploadLogo: (id: string, formData: FormData) =>
    api.post(`/companies/${id}/logo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const applicationsAPI = {
  getEmployerApplications: (params?: any) => api.get('/applications', { params }),
  getApplicationById: (id: string) => api.get(`/applications/${id}`),
  updateStatus: (id: string, data: { status: string; note?: string }) =>
    api.patch(`/applications/${id}/status`, data),
};

export const usersAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
  changePassword: (data: any) => api.post('/users/change-password', data),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};
