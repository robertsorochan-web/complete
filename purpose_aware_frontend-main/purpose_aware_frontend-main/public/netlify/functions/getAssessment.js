// netlify/functions/getAssessment.js
import fetch from 'node-fetch'; // optional on Netlify's newer runtimes

export async function handler(event, context) {
  const API_BASE = process.env.RENDER_API_BASE || 'https://ak-fa-fixit.onrender.com';
  try {
    const res = await fetch(`${API_BASE}/api/assessment`);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error('getAssessment error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
