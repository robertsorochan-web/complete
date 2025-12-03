// Uses VITE_API_BASE (if set) otherwise Netlify function proxy
const RENDER_FALLBACK = '/.netlify/functions/getAssessment';
const API_BASE = import.meta.env.VITE_API_BASE || RENDER_FALLBACK;

export const fetchAssessmentData = async () => {
  try {
    const res = await fetch(API_BASE, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      console.error('fetchAssessmentData non-ok', res.status, await res.text());
      return null;
    }
    // Some endpoints may return text, guard against invalid JSON:
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      // If body already JSON via res.json, fallback:
      try { return await res.json(); } catch (e) { console.error('Invalid JSON', e); return null; }
    }
  } catch (err) {
    console.error('Error fetching assessment data', err);
    return null;
  }
};
