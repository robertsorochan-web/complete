const purposeLayerConfig = {
  personal: {
    layers: ['Body & Health', 'Inner Beliefs', 'Values & Worldview', 'Daily Life', 'Self-Awareness'],
    context: 'personal life areas',
    roleDescription: 'a friendly life coach explaining things in simple, everyday language'
  },
  team: {
    layers: ['Team Capacity', 'Team Culture', 'Shared Practices', 'Team Dynamics', 'Leadership Clarity'],
    context: 'team performance dimensions',
    roleDescription: 'a team performance consultant helping improve team effectiveness'
  },
  business: {
    layers: ['Infrastructure', 'Company Culture', 'Market Position', 'Stakeholder Network', 'Strategic Vision'],
    context: 'organizational dimensions',
    roleDescription: 'a business strategist helping optimize organizational performance'
  },
  policy: {
    layers: ['Population Health', 'Institutional Norms', 'Policy Frameworks', 'Governance Systems', 'Research Insights'],
    context: 'system dimensions',
    roleDescription: 'a policy analyst providing evidence-based recommendations'
  }
};

export async function handler(event, context) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GROQ_API_KEY not configured' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { bioHardware, internalOS, culturalSoftware, socialInstance, consciousUser, purpose = 'personal' } = body;

    const config = purposeLayerConfig[purpose] || purposeLayerConfig.personal;
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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const insights = data.choices[0]?.message?.content || null;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insights })
    };
  } catch (err) {
    console.error('Groq insights error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
