const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'akorfa_token';

export const generateInsights = async (assessmentData, purpose = 'personal') => {
  if (!assessmentData) return null;

  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/api/ai/insights`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...assessmentData, purpose })
    });

    if (!res.ok) {
      console.error('generateInsights error:', res.status);
      return null;
    }

    const data = await res.json();
    return data.insights || null;
  } catch (err) {
    console.error('Error generating insights:', err);
    return null;
  }
};
