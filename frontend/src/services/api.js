const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Try to parse JSON, but handle cases where response might not be JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? { message: text } : { message: 'Request failed' };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // If it's already an Error object with a message, re-throw it
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise, wrap it in an Error
      throw new Error(error.message || 'Network error occurred');
    }
  }

  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getBalance() {
    return this.request('/balance', {
      method: 'GET',
    });
  }

  async getUsers() {
    return this.request('/users', {
      method: 'GET',
    });
  }

  async transfer(data) {
    const idempotencyKey = `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return this.request('/transfer', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    });
  }

  async approveRequest(transactionId) {
    return this.request('/transfer/approve', {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  }

  async rejectRequest(transactionId, reason) {
    return this.request('/transfer/reject', {
      method: 'POST',
      body: JSON.stringify({ transactionId, reason }),
    });
  }

  async reverseTransaction(transactionId, reason) {
    return this.request('/transfer/reverse', {
      method: 'POST',
      body: JSON.stringify({ transactionId, reason }),
    });
  }

  async bulkTransfer(file) {
    const formData = new FormData();
    formData.append('csv', file);
    const idempotencyKey = `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/transfer/bulk`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Idempotency-Key': idempotencyKey,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Bulk transfer failed');
    }

    return data;
  }

  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/transactions${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async exportTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const token = localStorage.getItem('token');
    const url = `${this.baseURL}/transactions/export${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Export failed');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `transactions_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  async dailyMint(amountPerUser) {
    return this.request('/daily-mint', {
      method: 'POST',
      body: JSON.stringify({ amountPerUser }),
    });
  }
}

export const api = new ApiService();

