import express from 'express';
import { query } from '../db/init.js';

const router = express.Router();

const callGroqAPI = async (systemPrompt, userPrompt) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

// Chat with AI coach
router.post('/chat', async (req, res) => {
  try {
    const { message, assessmentData } = req.body;

    const layerScores = `
Assessment Scores (1-10):
- Body & Health: ${assessmentData.bioHardware}
- Inner Beliefs: ${assessmentData.internalOS}
- Values & Worldview: ${assessmentData.culturalSoftware}
- Daily Life: ${assessmentData.socialInstance}
- Self-Awareness: ${assessmentData.consciousUser}`;

    const systemPrompt = `You are Akↄfa, an AI coach using the Akorfa Stack Framework. You help people understand their complex life/system layers and give practical advice. Use everyday language, be direct and helpful.`;

    const userPrompt = `${message}\n\n${layerScores}`;

    const response = await callGroqAPI(systemPrompt, userPrompt);

    // Save to chat history
    await query(
      'INSERT INTO chat_history (user_id, role, message) VALUES ($1, $2, $3)',
      [req.userId, 'user', message]
    );
    await query(
      'INSERT INTO chat_history (user_id, role, message) VALUES ($1, $2, $3)',
      [req.userId, 'assistant', response]
    );

    res.json({ response });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

// Diagnosis
router.post('/diagnosis', async (req, res) => {
  try {
    const { scenario, assessmentData } = req.body;

    const layerScores = `
Assessment Scores (1-10):
- Body & Health: ${assessmentData.bioHardware}
- Inner Beliefs: ${assessmentData.internalOS}
- Values & Worldview: ${assessmentData.culturalSoftware}
- Daily Life: ${assessmentData.socialInstance}
- Self-Awareness: ${assessmentData.consciousUser}`;

    const systemPrompt = `You are a diagnostic coach using the Akorfa Stack Framework. Respond ONLY with valid JSON:
{
  "summary": "Brief explanation of what's happening",
  "rootCauses": [{"layer": "Layer name", "explanation": "How it contributes"}],
  "actionSteps": [{"action": "Title", "description": "How to do it", "timeline": "When"}],
  "whyItHelps": "Why this will work"
}`;

    const userPrompt = `My situation: ${scenario}\n\n${layerScores}\n\nDiagnose which layers are involved and give me concrete steps.`;

    const responseText = await callGroqAPI(systemPrompt, userPrompt);

    let diagnosis;
    try {
      diagnosis = JSON.parse(responseText);
    } catch {
      diagnosis = {
        summary: responseText,
        rootCauses: [{ layer: 'Multiple', explanation: 'Your situation involves interconnected life areas' }],
        actionSteps: [
          { action: 'Start with awareness', description: 'Notice which areas feel broken', timeline: 'This week' }
        ],
        whyItHelps: 'When you fix one layer, others improve too.'
      };
    }

    // Save diagnosis
    await query(
      'INSERT INTO diagnosis_history (user_id, scenario, diagnosis) VALUES ($1, $2, $3)',
      [req.userId, scenario, JSON.stringify(diagnosis)]
    );

    res.json({ diagnosis });
  } catch (err) {
    console.error('Diagnosis error:', err);
    res.status(500).json({ error: 'Failed to get diagnosis' });
  }
});

export default router;
