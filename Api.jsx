// src/services/api.jsx
import axios from 'axios';

// Base configuration
const API_BASE_URL = 'http://localhost:3001';
const API_TIMEOUT = 10000; // 10 seconds

// Axios instance configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login if needed
      // window.location.href = '/login';
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Server connection failed. Make sure JSON Server is running on port 3001');
    }
    
    return Promise.reject(error);
  }
);

// Error handling utility
const handleApiError = (error) => {
  console.error('API Error Details:', error);
  
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data?.message || `Server error: ${error.response.status} - ${error.response.statusText}`,
      status: error.response.status,
      data: null,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error: Unable to connect to server. Make sure JSON Server is running on http://localhost:3001',
      status: null,
      data: null,
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null,
    };
  }
};

// Success response utility
const handleApiSuccess = (response, message = 'Operation successful') => {
  return {
    success: true,
    data: response.data,
    message: message,
    status: response.status,
  };
};

// ===================
// GOALS API FUNCTIONS
// ===================

export const goalsApi = {
  // Get all goals
  async getAllGoals() {
    try {
      console.log('Fetching all goals...');
      const response = await api.get('/goals');
      return handleApiSuccess(response, 'Goals fetched successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get goal by ID
  async getGoalById(id) {
    try {
      console.log(`Fetching goal with ID: ${id}`);
      const response = await api.get(`/goals/${id}`);
      return handleApiSuccess(response, 'Goal fetched successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new goal
  async createGoal(goalData) {
    try {
      console.log('Creating new goal:', goalData);
      const newGoal = {
        ...goalData,
        id: Date.now(), // Simple ID generation for JSON Server
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: goalData.progress || 0,
        status: goalData.status || 'Not Started',
      };
      
      const response = await api.post('/goals', newGoal);
      return handleApiSuccess(response, 'Goal created successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update goal
  async updateGoal(id, goalData) {
    try {
      console.log(`Updating goal ${id}:`, goalData);
      const updatedGoal = {
        ...goalData,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await api.put(`/goals/${id}`, updatedGoal);
      return handleApiSuccess(response, 'Goal updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update goal progress only
  async updateGoalProgress(id, progress) {
    try {
      console.log(`Updating progress for goal ${id}: ${progress}%`);
      const updateData = {
        progress: Math.max(0, Math.min(100, progress)), // Ensure progress is between 0-100
        updatedAt: new Date().toISOString(),
      };
      
      // If progress is 100, mark as completed
      if (progress >= 100) {
        updateData.status = 'Completed';
      } else if (progress > 0) {
        updateData.status = 'In Progress';
      }
      
      const response = await api.patch(`/goals/${id}`, updateData);
      return handleApiSuccess(response, 'Progress updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update goal status
  async updateGoalStatus(id, status) {
    try {
      console.log(`Updating status for goal ${id}: ${status}`);
      const updateData = {
        status,
        updatedAt: new Date().toISOString(),
      };
      
      // Auto-update progress based on status
      if (status === 'Completed') {
        updateData.progress = 100;
      } else if (status === 'Not Started') {
        updateData.progress = 0;
      }
      
      const response = await api.patch(`/goals/${id}`, updateData);
      return handleApiSuccess(response, 'Status updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete goal
  async deleteGoal(id) {
    try {
      console.log(`Deleting goal with ID: ${id}`);
      await api.delete(`/goals/${id}`);
      return {
        success: true,
        message: 'Goal deleted successfully',
        data: { id },
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get goals by status
  async getGoalsByStatus(status) {
    try {
      console.log(`Fetching goals with status: ${status}`);
      const response = await api.get(`/goals?status=${encodeURIComponent(status)}`);
      return handleApiSuccess(response, `Goals with status '${status}' fetched successfully`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get goals by category
  async getGoalsByCategory(category) {
    try {
      console.log(`Fetching goals in category: ${category}`);
      const response = await api.get(`/goals?category=${encodeURIComponent(category)}`);
      return handleApiSuccess(response, `Goals in category '${category}' fetched successfully`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get goals by priority
  async getGoalsByPriority(priority) {
    try {
      console.log(`Fetching goals with priority: ${priority}`);
      const response = await api.get(`/goals?priority=${encodeURIComponent(priority)}`);
      return handleApiSuccess(response, `Goals with priority '${priority}' fetched successfully`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Search goals by title or description
  async searchGoals(searchTerm) {
    try {
      console.log(`Searching goals for: ${searchTerm}`);
      const response = await api.get(`/goals?q=${encodeURIComponent(searchTerm)}`);
      return handleApiSuccess(response, `Search results for '${searchTerm}' fetched successfully`);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// ======================
// CATEGORIES API FUNCTIONS
// ======================

export const categoriesApi = {
  // Get all categories
  async getAllCategories() {
    try {
      console.log('Fetching all categories...');
      const response = await api.get('/categories');
      return handleApiSuccess(response, 'Categories fetched successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get category by ID
  async getCategoryById(id) {
    try {
      console.log(`Fetching category with ID: ${id}`);
      const response = await api.get(`/categories/${id}`);
      return handleApiSuccess(response, 'Category fetched successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new category
  async createCategory(categoryData) {
    try {
      console.log('Creating new category:', categoryData);
      const newCategory = {
        ...categoryData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      
      const response = await api.post('/categories', newCategory);
      return handleApiSuccess(response, 'Category created successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update category
  async updateCategory(id, categoryData) {
    try {
      console.log(`Updating category ${id}:`, categoryData);
      const updatedCategory = {
        ...categoryData,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await api.put(`/categories/${id}`, updatedCategory);
      return handleApiSuccess(response, 'Category updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      console.log(`Deleting category with ID: ${id}`);
      await api.delete(`/categories/${id}`);
      return {
        success: true,
        message: 'Category deleted successfully',
        data: { id },
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// ======================
// MILESTONES API FUNCTIONS
// ======================

export const milestonesApi = {
  // Get all milestones
  async getAllMilestones() {
    try {
      console.log('Fetching all milestones...');
      const response = await api.get('/milestones');
      return handleApiSuccess(response, 'Milestones fetched successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get milestones by goal ID
  async getMilestonesByGoal(goalId) {
    try {
      console.log(`Fetching milestones for goal: ${goalId}`);
      const response = await api.get(`/milestones?goalId=${goalId}`);
      return handleApiSuccess(response, 'Goal milestones fetched successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get milestone by ID
  async getMilestoneById(id) {
    try {
      console.log(`Fetching milestone with ID: ${id}`);
      const response = await api.get(`/milestones/${id}`);
      return handleApiSuccess(response, 'Milestone fetched successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create new milestone
  async createMilestone(milestoneData) {
    try {
      console.log('Creating new milestone:', milestoneData);
      const newMilestone = {
        ...milestoneData,
        id: Date.now(),
        completed: milestoneData.completed || false,
        createdAt: new Date().toISOString(),
      };
      
      const response = await api.post('/milestones', newMilestone);
      return handleApiSuccess(response, 'Milestone created successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update milestone
  async updateMilestone(id, milestoneData) {
    try {
      console.log(`Updating milestone ${id}:`, milestoneData);
      const updatedMilestone = {
        ...milestoneData,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await api.put(`/milestones/${id}`, updatedMilestone);
      return handleApiSuccess(response, 'Milestone updated successfully');
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Toggle milestone completion
  async toggleMilestoneCompletion(id, completed = null) {
    try {
      // If completed is not provided, we need to fetch current state first
      if (completed === null) {
        const currentResult = await this.getMilestoneById(id);
        if (!currentResult.success) return currentResult;
        completed = !currentResult.data.completed;
      }
      
      console.log(`${completed ? 'Completing' : 'Uncompleting'} milestone ${id}`);
      const updateData = {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await api.patch(`/milestones/${id}`, updateData);
      return handleApiSuccess(response, `Milestone ${completed ? 'completed' : 'reopened'} successfully`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete milestone
  async deleteMilestone(id) {
    try {
      console.log(`Deleting milestone with ID: ${id}`);
      await api.delete(`/milestones/${id}`);
      return {
        success: true,
        message: 'Milestone deleted successfully',
        data: { id },
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// ======================
// UTILITY FUNCTIONS
// ======================

// Test API connection
export const testConnection = async () => {
  try {
    console.log('Testing API connection...');
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      console.log('✅ API connection successful');
      return {
        success: true,
        message: 'API connection successful',
        status: response.status,
      };
    } else {
      console.log('❌ API connection failed:', response.status);
      return {
        success: false,
        message: `API connection failed: ${response.status} - ${response.statusText}`,
        status: response.status,
      };
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return {
      success: false,
      message: error.name === 'TimeoutError' 
        ? 'Connection timeout: Server took too long to respond' 
        : `Connection error: ${error.message}`,
      status: null,
    };
  }
};

// Check if JSON Server is running
export const checkServer = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/db`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'JSON Server is running',
        data: {
          endpoints: Object.keys(data),
          counts: Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? value.length : 'N/A'])
          ),
        },
      };
    } else {
      return {
        success: false,
        message: 'JSON Server responded with error',
        status: response.status,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'JSON Server is not running or not accessible',
      error: error.message,
    };
  }
};

// Get API statistics
export const getApiStats = async () => {
  try {
    const [goalsResult, categoriesResult, milestonesResult] = await Promise.allSettled([
      goalsApi.getAllGoals(),
      categoriesApi.getAllCategories(),
      milestonesApi.getAllMilestones(),
    ]);

    const stats = {
      goals: goalsResult.status === 'fulfilled' && goalsResult.value.success 
        ? goalsResult.value.data.length 
        : 0,
      categories: categoriesResult.status === 'fulfilled' && categoriesResult.value.success 
        ? categoriesResult.value.data.length 
        : 0,
      milestones: milestonesResult.status === 'fulfilled' && milestonesResult.value.success 
        ? milestonesResult.value.data.length 
        : 0,
    };

    return {
      success: true,
      data: stats,
      message: 'API statistics fetched successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Bulk operations
export const bulkOperations = {
  // Bulk update goals
  async bulkUpdateGoals(updates) {
    console.log(`Performing bulk update on ${updates.length} goals`);
    const results = await Promise.allSettled(
      updates.map(({ id, data }) => goalsApi.updateGoal(id, data))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success);

    return {
      success: failed.length === 0,
      successful: successful.length,
      failed: failed.length,
      results: results,
      message: `Bulk update completed: ${successful.length} successful, ${failed.length} failed`,
    };
  },

  // Bulk delete goals
  async bulkDeleteGoals(ids) {
    console.log(`Performing bulk delete on ${ids.length} goals`);
    const results = await Promise.allSettled(
      ids.map(id => goalsApi.deleteGoal(id))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success);

    return {
      success: failed.length === 0,
      successful: successful.length,
      failed: failed.length,
      results: results,
      message: `Bulk delete completed: ${successful.length} successful, ${failed.length} failed`,
    };
  },

  // Bulk create goals
  async bulkCreateGoals(goalsData) {
    console.log(`Performing bulk create on ${goalsData.length} goals`);
    const results = await Promise.allSettled(
      goalsData.map(goalData => goalsApi.createGoal(goalData))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success);

    return {
      success: failed.length === 0,
      successful: successful.length,
      failed: failed.length,
      results: results,
      data: successful.map(r => r.value.data),
      message: `Bulk create completed: ${successful.length} successful, ${failed.length} failed`,
    };
  },
};

// ======================
// REACT HOOKS
// ======================

import { useState, useEffect, useCallback } from 'react';

// Custom hook for goals management
export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await goalsApi.getAllGoals();
    
    if (result.success) {
      setGoals(result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const createGoal = async (goalData) => {
    const result = await goalsApi.createGoal(goalData);
    if (result.success) {
      setGoals(prev => [...prev, result.data]);
    }
    return result;
  };

  const updateGoal = async (id, goalData) => {
    const result = await goalsApi.updateGoal(id, goalData);
    if (result.success) {
      setGoals(prev => prev.map(goal => 
        goal.id === id ? result.data : goal
      ));
    }
    return result;
  };

  const updateGoalProgress = async (id, progress) => {
    const result = await goalsApi.updateGoalProgress(id, progress);
    if (result.success) {
      setGoals(prev => prev.map(goal => 
        goal.id === id ? { ...goal, ...result.data } : goal
      ));
    }
    return result;
  };

  const deleteGoal = async (id) => {
    const result = await goalsApi.deleteGoal(id);
    if (result.success) {
      setGoals(prev => prev.filter(goal => goal.id !== id));
    }
    return result;
  };

  const refreshGoals = () => {
    loadGoals();
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal,
    refreshGoals,
    loadGoals,
  };
};

// Custom hook for categories management
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await categoriesApi.getAllCategories();
    
    if (result.success) {
      setCategories(result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const createCategory = async (categoryData) => {
    const result = await categoriesApi.createCategory(categoryData);
    if (result.success) {
      setCategories(prev => [...prev, result.data]);
    }
    return result;
  };

  const updateCategory = async (id, categoryData) => {
    const result = await categoriesApi.updateCategory(id, categoryData);
    if (result.success) {
      setCategories(prev => prev.map(cat => 
        cat.id === id ? result.data : cat
      ));
    }
    return result;
  };

  const deleteCategory = async (id) => {
    const result = await categoriesApi.deleteCategory(id);
    if (result.success) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
    return result;
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: loadCategories,
  };
};

// Export default api instance
export default api;

// Export configuration
export { API_BASE_URL, API_TIMEOUT };