const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const STORAGE_KEY = 'akorfa_user';
const TOKEN_KEY = 'akorfa_token';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API error');
  }

  return response.json();
};

export const signup = async (email, password, purpose, name) => {
  const data = await apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, purpose })
  });
  
  localStorage.setItem(TOKEN_KEY, data.token);
  const user = { id: data.id, email: data.email, name: data.name, purpose: data.purpose };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const login = async (email, password) => {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  localStorage.setItem(TOKEN_KEY, data.token);
  const user = { id: data.id, email: data.email, name: data.name, purpose: data.purpose };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEY);
  const token = localStorage.getItem(TOKEN_KEY);
  return user && token ? JSON.parse(user) : null;
};

export const updateUserAssessment = async (userId, assessmentData) => {
  return apiCall('/assessments', {
    method: 'POST',
    body: JSON.stringify({
      bioHardware: assessmentData.bioHardware,
      internalOS: assessmentData.internalOS,
      culturalSoftware: assessmentData.culturalSoftware,
      socialInstance: assessmentData.socialInstance,
      consciousUser: assessmentData.consciousUser
    })
  });
};

export const getUserAssessment = async (userId) => {
  try {
    const data = await apiCall('/assessments');
    return {
      bioHardware: data.bioHardware,
      internalOS: data.internalOS,
      culturalSoftware: data.culturalSoftware,
      socialInstance: data.socialInstance,
      consciousUser: data.consciousUser
    };
  } catch (err) {
    return {
      bioHardware: 5,
      internalOS: 5,
      culturalSoftware: 5,
      socialInstance: 5,
      consciousUser: 5
    };
  }
};

export const chatWithAkofa = async (message, assessmentData, purpose = 'personal', conversationHistory = []) => {
  try {
    const data = await apiCall('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, assessmentData, conversationHistory, purpose })
    });
    return data.response;
  } catch (err) {
    console.error('Chat error:', err);
    return 'Sorry, I couldn\'t process your message. Please try again.';
  }
};

export const getDiagnosis = async (scenario, assessmentData, purpose = 'personal') => {
  try {
    const data = await apiCall('/ai/diagnosis', {
      method: 'POST',
      body: JSON.stringify({ scenario, assessmentData, purpose })
    });
    return data.diagnosis;
  } catch (err) {
    console.error('Diagnosis error:', err);
    return {
      summary: 'Unable to generate diagnosis. Please try again.',
      rootCauses: [],
      actionSteps: []
    };
  }
};
