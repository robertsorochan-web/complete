const purposeLayerConfig = {
  personal: {
    layers: ['Body & Health', 'Inner Beliefs', 'Values & Worldview', 'Daily Life', 'Self-Awareness'],
    context: 'life areas',
    frameworkName: 'Akorfa Stack Framework',
    roleDescription: 'a supportive coach helping someone understand and improve their life'
  },
  team: {
    layers: ['Team Capacity', 'Team Culture', 'Shared Practices', 'Team Dynamics', 'Leadership Clarity'],
    context: 'team dimensions',
    frameworkName: 'Akorfa Team Framework',
    roleDescription: 'a team performance consultant helping improve collaboration and effectiveness'
  },
  business: {
    layers: ['Infrastructure', 'Company Culture', 'Market Position', 'Stakeholder Network', 'Strategic Vision'],
    context: 'organizational dimensions',
    frameworkName: 'Akorfa Business Framework',
    roleDescription: 'a business strategist helping optimize organizational growth'
  },
  policy: {
    layers: ['Population Health', 'Institutional Norms', 'Policy Frameworks', 'Governance Systems', 'Research Insights'],
    context: 'system dimensions',
    frameworkName: 'Akorfa Policy Framework',
    roleDescription: 'a policy analyst providing evidence-based systemic recommendations'
  }
};

export async function handler(event, context) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GROQ_API_KEY not configured' }) };
  }

  try {
    const { message, assessmentData, conversationHistory, purpose = 'personal' } = JSON.parse(event.body);
    
    const config = purposeLayerConfig[purpose] || purposeLayerConfig.personal;
    const scores = [
      assessmentData.bioHardware,
      assessmentData.internalOS,
      assessmentData.culturalSoftware,
      assessmentData.socialInstance,
      assessmentData.consciousUser
    ];
    
    const layerDescriptions = config.layers.map((name, i) => `- ${name}: ${scores[i]}`).join('\n');

    const conversationContext = conversationHistory.map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n');

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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'I couldn\'t generate a response. Try rephrasing your question.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: aiResponse })
    };
  } catch (err) {
    console.error('Chat error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
