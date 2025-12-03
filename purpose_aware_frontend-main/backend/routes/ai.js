import express from 'express';
import { query } from '../db/init.js';
import { getPurposeConfig } from '../config/purposeConfig.js';

const router = express.Router();

const callGroqAPI = async (messages, maxTokens = 1200) => {
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
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

router.post('/chat', async (req, res) => {
  try {
    const { message, assessmentData, conversationHistory = [], purpose = 'personal' } = req.body;

    const config = getPurposeConfig(purpose);
    const scores = [
      assessmentData.bioHardware,
      assessmentData.internalOS,
      assessmentData.culturalSoftware,
      assessmentData.socialInstance,
      assessmentData.consciousUser
    ];
    
    const layerDescriptions = config.layers.map((name, i) => `- ${name}: ${scores[i]}`).join('\n');

    const systemPrompt = `You are ${config.roleDescription} using the ${config.frameworkName}—5 interconnected ${config.context} that all affect each other.

Based on their assessment (rated 1-10 for each):
${layerDescriptions}

Your job is to:
1. Help them understand what their scores mean
2. Show how different ${config.context} affect each other
3. Give concrete, actionable steps to improve
4. Use everyday language, not jargon
5. Focus on their specific situation and goals
6. Always tie advice back to the framework and their scores

Be warm, encouraging, and practical. Ask clarifying questions when needed.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const response = await callGroqAPI(messages, 800);

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

router.post('/diagnosis', async (req, res) => {
  try {
    const { scenario, assessmentData, purpose = 'personal' } = req.body;

    const config = getPurposeConfig(purpose);
    const scores = [
      assessmentData.bioHardware,
      assessmentData.internalOS,
      assessmentData.culturalSoftware,
      assessmentData.socialInstance,
      assessmentData.consciousUser
    ];

    const layerScores = config.layers.map((name, i) => `- ${name}: ${scores[i]}`).join('\n');
    const layerExplanations = config.layers.map((name, i) => `- ${name}: ${config.descriptions[i]}`).join('\n');

    const systemPrompt = `You are ${config.roleDescription} using the Akorfa Stack Framework. When someone describes a problem, you:
1. Identify which of the 5 ${config.context} are contributing to it
2. Show how they interact and make the problem worse
3. Provide 4-5 specific, concrete action steps to fix it
4. Use everyday language, not theory

The 5 ${config.context} are:
${layerExplanations}

You MUST respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "summary": "Brief explanation of what's happening and why",
  "rootCauses": [
    {
      "layer": "Layer name",
      "explanation": "How this ${config.context.slice(0, -1)} is contributing to the problem"
    }
  ],
  "actionSteps": [
    {
      "action": "Specific action title",
      "description": "How to do it and why it matters",
      "timeline": "When to do it (e.g., 'This week', 'Starting tomorrow', 'Daily')"
    }
  ],
  "whyItHelps": "Brief explanation of how fixing these things will solve the problem"
}`;

    const userPrompt = `The situation: ${scenario}

Assessment Scores (1-10):
${layerScores}

Please diagnose which ${config.context} are involved and give concrete steps to improve.`;

    const responseText = await callGroqAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 1200);

    let diagnosis;
    try {
      diagnosis = JSON.parse(responseText);
    } catch {
      diagnosis = {
        summary: responseText,
        rootCauses: [{ layer: 'Multiple', explanation: `Your situation involves interconnected ${config.context}` }],
        actionSteps: [
          { action: 'Start with awareness', description: `Take time to notice which ${config.context} feel most problematic`, timeline: 'This week' },
          { action: 'Pick one area to focus on first', description: 'Usually your lowest-scoring dimension', timeline: 'This week' },
          { action: 'Take one small action in that area', description: 'Just one thing. Build momentum.', timeline: 'Starting tomorrow' }
        ],
        whyItHelps: `When you improve one ${config.context.slice(0, -1)}, the others tend to improve too. Start with the weakest link.`
      };
    }

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

router.post('/insights', async (req, res) => {
  try {
    const { bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser, purpose = 'personal' } = req.body;

    const config = getPurposeConfig(purpose);
    const allLayers = [bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser];
    const avgScore = (allLayers.reduce((a, b) => a + b, 0) / allLayers.length).toFixed(2);
    
    const bottleneckIndex = allLayers.indexOf(Math.min(...allLayers));
    const bottleneck = config.layers[bottleneckIndex];

    const layerDescriptions = config.layers.map((name, i) => `${i + 1}. ${name.toUpperCase()} (score: ${allLayers[i]})`).join('\n');

    const prompt = `You are ${config.roleDescription}. Avoid jargon.

Here's an assessment across 5 ${config.context} (scored 1-10):

${layerDescriptions}

Overall health score: ${avgScore}/10
Weakest area right now: ${bottleneck}

Give 3-4 practical, friendly suggestions. Focus on the weakest area first. Use real-world examples, not theory. Keep it short and actionable. Speak like you're talking to a friend or colleague.`;

    const insights = await callGroqAPI([{ role: 'user', content: prompt }], 600);

    res.json({ insights });
  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

export default router;
