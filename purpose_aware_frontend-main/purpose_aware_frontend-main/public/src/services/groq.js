export const generateInsights = async (assessmentData, purpose = 'personal') => {
  if (!assessmentData) return null;

  try {
    const res = await fetch('/.netlify/functions/groqInsights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
