const purposeLayerConfig = {
  personal: {
    layers: ['Body & Health', 'Inner Beliefs', 'Values & Worldview', 'Daily Life', 'Self-Awareness'],
    descriptions: [
      'Sleep, exercise, nutrition, energy',
      'Self-talk, confidence, trauma recovery, feeling worthy',
      'What matters to you, your principles',
      'Job, relationships, environment, money',
      'Noticing what\'s happening, making conscious choices'
    ],
    context: 'life areas',
    roleDescription: 'a diagnostic coach'
  },
  team: {
    layers: ['Team Capacity', 'Team Culture', 'Shared Practices', 'Team Dynamics', 'Leadership Clarity'],
    descriptions: [
      'Skills, bandwidth, resources, capabilities',
      'Trust, psychological safety, team values',
      'Processes, tools, ways of working together',
      'Communication, collaboration, conflict resolution',
      'Vision, direction, decision-making authority'
    ],
    context: 'team dimensions',
    roleDescription: 'a team performance consultant'
  },
  business: {
    layers: ['Infrastructure', 'Company Culture', 'Market Position', 'Stakeholder Network', 'Strategic Vision'],
    descriptions: [
      'Technology, operations, resources, systems',
      'Values, norms, how people behave',
      'Competitive advantage, market fit, brand',
      'Customers, partners, investors, community',
      'Long-term goals, strategy, leadership direction'
    ],
    context: 'organizational dimensions',
    roleDescription: 'a business strategist'
  },
  policy: {
    layers: ['Population Health', 'Institutional Norms', 'Policy Frameworks', 'Governance Systems', 'Research Insights'],
    descriptions: [
      'Public health indicators, demographics, wellbeing metrics',
      'Social norms, institutional practices, cultural patterns',
      'Regulations, laws, policy instruments',
      'Decision-making structures, accountability, coordination',
      'Evidence base, research findings, data-driven insights'
    ],
    context: 'system dimensions',
    roleDescription: 'a policy analyst'
  }
};

export async function handler(event, context) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GROQ_API_KEY not configured' }) };
  }

  try {
    const { scenario, assessmentData, purpose = 'personal' } = JSON.parse(event.body);

    const config = purposeLayerConfig[purpose] || purposeLayerConfig.personal;
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
    const responseText = data.choices[0]?.message?.content || '';

    let diagnosis;
    try {
      diagnosis = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diagnosis })
    };
  } catch (err) {
    console.error('Diagnosis error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
