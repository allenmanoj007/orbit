import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor – attach JWT ────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('orbit_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor – handle auth errors ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('orbit_admin_token');
      localStorage.removeItem('orbit_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

// ─── Typed helpers ────────────────────────────────────────────────────────────

export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post<{ token: string; user: AdminUser }>('/admin/auth/login', {
      email,
      password,
    }),

  logout: () => api.post('/admin/auth/logout'),

  // Dashboard stats
  getStats: () => api.get<DashboardStats>('/admin/stats'),
  getUserGrowth: (days = 30) =>
    api.get<GrowthDataPoint[]>('/admin/stats/growth', { params: { days } }),

  // Users
  getUsers: (params: UsersQueryParams) =>
    api.get('/admin/users', { params }),

  getUserById: (id: string) => api.get(`/admin/users/${id}`),

  updateUserStatus: (
    id: string,
    action: 'suspend' | 'unsuspend' | 'ban' | 'unban' | 'make-admin' | 'remove-admin',
    payload?: Record<string, unknown>,
  ) => api.post(`/admin/users/${id}/${action}`, payload),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  sendWarning: (id: string, message: string) =>
    api.post(`/admin/users/${id}/warning`, { message }),

  // Reports
  getReports: (params: ReportsQueryParams) =>
    api.get('/admin/reports', { params }),

  updateReport: (
    id: string,
    action: 'resolve' | 'dismiss',
    outcome?: string,
  ) => api.post(`/admin/reports/${id}/${action}`, { outcome }),

  // Interests & Hobbies
  getInterests: () => api.get('/admin/interests'),
  createInterest: (data: InterestPayload) => api.post('/admin/interests', data),
  updateInterest: (id: string, data: Partial<InterestPayload>) =>
    api.patch(`/admin/interests/${id}`, data),
  deleteInterest: (id: string) => api.delete(`/admin/interests/${id}`),

  getHobbies: () => api.get('/admin/hobbies'),
  createHobby: (data: InterestPayload) => api.post('/admin/hobbies', data),
  updateHobby: (id: string, data: Partial<InterestPayload>) =>
    api.patch(`/admin/hobbies/${id}`, data),
  deleteHobby: (id: string) => api.delete(`/admin/hobbies/${id}`),

  // Content
  getFlaggedContent: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/content/flagged', { params }),

  moderateContent: (contentId: string, action: 'approve' | 'remove') =>
    api.post(`/admin/content/${contentId}/moderate`, { action }),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings: Record<string, unknown>) =>
    api.patch('/admin/settings', settings),

  getAdminUsers: () => api.get('/admin/admins'),
  getSystemHealth: () => api.get('/admin/health'),
};

// ─── Local Types ──────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isAdmin: true;
}

export interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  totalMessages: number;
  pendingReports: number;
  newSignups7d: number;
  newSignupsChange: number; // percentage vs previous 7d
  activeChange: number;
  reportsChange: number;
}

export interface GrowthDataPoint {
  date: string; // YYYY-MM-DD
  newUsers: number;
  activeUsers: number;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'banned' | 'suspended' | 'verified' | 'admin';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReportsQueryParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  reason?: string;
}

export interface InterestPayload {
  name: string;
  emoji?: string;
  category?: string;
  isActive?: boolean;
}
