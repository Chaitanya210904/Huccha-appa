const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Network request failed');
  }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Panchang
  getDailyPanchang: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/panchang/daily?${q}`);
  },
  getMonthPanchang: (year, month) => request(`/panchang/month?year=${year}&month=${month}`),
  generateSankalpa: (body) => request('/panchang/sankalpa', { method: 'POST', body: JSON.stringify(body) }),
  getCities: () => request('/panchang/cities'),
  getFestivals: () => request('/panchang/festivals'),
  getUploadedCalendars: () => request('/panchang/uploaded-calendars'),
  uploadCalendarPdf: (body) => request('/panchang/upload-calendar', { method: 'POST', body: JSON.stringify(body) }),

  // Shraddha
  getUpcomingShraddhas: (days = 30) => request(`/shraddha/upcoming?days=${days}`),
  calculateAnnualShraddha: (body) => request('/shraddha/calculate-annual', { method: 'POST', body: JSON.stringify(body) }),
  getMahalaya: (year) => request(`/shraddha/mahalaya?year=${year}`),
  generateMessage: (body) => request('/shraddha/generate-message', { method: 'POST', body: JSON.stringify(body) }),

  // Clients
  getClients: () => request('/clients'),
  getClientById: (id) => request(`/clients/${id}`),
  createClient: (body) => request('/clients', { method: 'POST', body: JSON.stringify(body) }),
  updateClient: (id, body) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),
  addFamilyMember: (clientId, body) => request(`/clients/${clientId}/family`, { method: 'POST', body: JSON.stringify(body) }),

  // Deceased Ancestors
  getDeceased: () => request('/deceased'),
  getDeceasedById: (id) => request(`/deceased/${id}`),
  createDeceased: (body) => request('/deceased', { method: 'POST', body: JSON.stringify(body) }),
  updateDeceased: (id, body) => request(`/deceased/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteDeceased: (id) => request(`/deceased/${id}`, { method: 'DELETE' }),
  calculateDeathDetails: (body) => request('/deceased/calculate-details', { method: 'POST', body: JSON.stringify(body) }),

  // Bookings
  getBookings: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/bookings?${q}`);
  },
  getBookingById: (id) => request(`/bookings/${id}`),
  createBooking: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  updateBooking: (id, body) => request(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBooking: (id) => request(`/bookings/${id}`, { method: 'DELETE' }),

  // Finance
  getPayments: () => request('/finance/payments'),
  createPayment: (body) => request('/finance/payments', { method: 'POST', body: JSON.stringify(body) }),
  getExpenses: () => request('/finance/expenses'),
  createExpense: (body) => request('/finance/expenses', { method: 'POST', body: JSON.stringify(body) }),
  deleteExpense: (id) => request(`/finance/expenses/${id}`, { method: 'DELETE' }),
  getReceipt: (paymentId) => request(`/finance/receipt/${paymentId}`),
  getLedger: () => request('/finance/ledger'),

  // Puja Samagri Checklists & Templates
  getPujaSamagriList: () => request('/inventory/pujas'),
  getPujaSamagri: (id) => request(`/inventory/pujas/${id}`),
  createPuja: (body) => request('/inventory/pujas', { method: 'POST', body: JSON.stringify(body) }),
  updatePuja: (id, body) => request(`/inventory/pujas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePuja: (id) => request(`/inventory/pujas/${id}`, { method: 'DELETE' }),
  addSamagriItem: (pujaId, body) => request(`/inventory/pujas/${pujaId}/items`, { method: 'POST', body: JSON.stringify(body) }),
  updateSamagriItem: (pujaId, itemId, body) => request(`/inventory/pujas/${pujaId}/items/${itemId}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSamagriItem: (pujaId, itemId) => request(`/inventory/pujas/${pujaId}/items/${itemId}`, { method: 'DELETE' }),

  // Legacy Inventory & Templates
  getInventory: () => request('/inventory'),
  createInventoryItem: (body) => request('/inventory', { method: 'POST', body: JSON.stringify(body) }),
  updateInventoryItem: (id, body) => request(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteInventoryItem: (id) => request(`/inventory/${id}`, { method: 'DELETE' }),
  getSamagriTemplate: (serviceId) => request(`/inventory/templates/${serviceId}`),

  // Assistants & Services
  getAssistants: () => request('/system/assistants'),
  createAssistant: (body) => request('/system/assistants', { method: 'POST', body: JSON.stringify(body) }),
  updateAssistant: (id, body) => request(`/system/assistants/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAssistant: (id) => request(`/system/assistants/${id}`, { method: 'DELETE' }),
  getServices: () => request('/system/services'),

  // Reports
  getFinancialSummary: (year) => request(`/reports/finance?year=${year}`),

  // Settings & System
  getSettings: () => request('/system/settings'),
  updateSettings: (body) => request('/system/settings', { method: 'PUT', body: JSON.stringify(body) }),
  seedDemoData: () => request('/system/seed-demo', { method: 'POST' }),
  getSnapshots: () => request('/backup/snapshots'),
  createSnapshot: () => request('/backup/create', { method: 'POST' }),
  restoreSnapshot: (id) => request(`/backup/restore/${id}`, { method: 'POST' })
};

