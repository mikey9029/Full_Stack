import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const jobService = {
  getJobs: () => api.get('/jobs'),
  postJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.patch(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  applyForJob: (jobId) => api.post(`/jobs/${jobId}/apply`),
  getApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  getStudents: () => api.get('/users/students'),
  deleteStudent: (id) => api.delete(`/users/students/${id}`),
  verifyStudent: (id) => api.patch(`/users/students/${id}/verify`),
  contactStudent: (id) => api.post(`/users/students/${id}/contact`),
  uploadResume: (formData) => api.post('/users/profile/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const applicationService = {
  getStudentApplications: () => api.get('/applications/student'),
  getAdminApplications: () => api.get('/applications/admin'),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  submitWish: (id, wish) => api.patch(`/applications/${id}/wish`, { studentPreferredTime: wish }),
};

export const companyService = {
  getCompanies: () => api.get('/companies'),
};

export default api;
