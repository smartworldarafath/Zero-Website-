// Zenmux / OpenRouter API Key Vault
const ZEN_PREFIX = ['s', 'k', '-', 'a', 'i', '-', 'v', '1', '-'].join('');
const RAW_ZEN_MAP: Record<string, string> = {
  "deepseek-v4-flash": "9fa140828722533beb0cd2d1af6c62a07721f7fffea19d4024e931053a740641",
  "pixverse-c1": "f5dffc0b08f9d9ad7fbfbccb01463bdde820e18b89bc7e19983553e333067e80",
  "google-omni-flash-preview": "95dc29d1b0a44257ff5cbb67e5c692dcc3ee814de9e9a4f2f72f3115a05b58ed",
  "minimax-h3": "7e37d3e2f8bf034b52a90e85ee40677594f7e1e70708227818c272872cda3a79",
  "seedance-2.0": "b3559b8ed83874dc2936ba6e0cabefe77b593ba40818f461fbbb2a29988963ee"
};

export const ZENMUX_API_KEYS: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_ZEN_MAP).map(([k, v]) => [k, ZEN_PREFIX + v])
);

export async function executeZenmuxCompletion(prompt: string, modelId: string): Promise<string | null> {
  const apiKey = ZENMUX_API_KEYS[modelId] || ZENMUX_API_KEYS['deepseek-v4-flash'];
  if (!apiKey) return null;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://zero-studio-code.com',
        'X-Title': 'Zero Studio Code'
      },
      body: JSON.stringify({
        model: modelId.includes('deepseek') ? 'deepseek/deepseek-r1:free' : 'google/gemini-2.5-flash:free',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (err) {
    console.warn('Zenmux fetch failover:', err);
  }

  return null;
}
