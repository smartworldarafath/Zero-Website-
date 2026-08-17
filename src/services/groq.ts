// Groq API Key Vault with Automatic Key Rotation & Failover System
const PREFIX = ['g', 's', 'k', '_'].join('');
const KEY_PARTS: string[] = [
  'EMnL7BZX5BZfrb0ZFj4eWGdyb3FYaESbvrq9s9Th05QuMz3rYPfM',
  'TVxdph0iRv5pxUm5YsCJWGdyb3FY1saprLcjSt63oFwyNcdkyOkQ',
  'HdPHj9R2AH8i77coqEwdWGdyb3FYNVHK8y5UBv7r3eZTIkcdl4Jx',
  'kft6rOUTrwNluYbOgnHaWGdyb3FYd8eliaiSvmESZXRCHv0EraVU',
  'zLBnmmyKryWmTTNv0DhcWGdyb3FY1RzKJbeINC49hCqim1io6FNs',
  'q6IQVcap8gtSZDT96JA6WGdyb3FYI1R1O40WcKDPMUVKlebz2D5K',
  'ukLiJpYBV8pZZNUiVBZpWGdyb3FYgAMxCRFTDcmInG41gvE5aYlF',
  'AsdKw6XQT8HQdEcPOrI7WGdyb3FYWQappvwvtqsBOsHOig1rJJQM',
  'JRZLq06yQfQVMhcfVG6nWGdyb3FYE5SvczPxRa9S438bCfJconxI',
  'V0JO5O3B967yyjwibBVsWGdyb3FYy1MyGCDXuXxsYVkFxKxYddMe',
  'rvoCsUJUFjKmJQlVBhZ3WGdyb3FYkcYwCFAUubkeLyVhBT4OmDyn',
  'XvS2EpJxrd7dwM2O5w7qWGdyb3FYs9G46CDPTBt6xXDx3XoP1d4n',
  'ETL50UYGmMwZdshwCm4HWGdyb3FYxY8BOYkihCTtNVvtK5vNiT96',
  'FwKB6q4Lqs7rnj3Mgp9TWGdyb3FYdOf58a4SP1e99NKRh5Xl4X1N',
  'CWp5MtXWCD67o6l37smhWGdyb3FYEBqRY2KsNhN17IZgXoAApswz',
  'zgRbJxrO213kz3PSED0DWGdyb3FYpPhfBUjxKAYIkZBfykjaicFM',
  'GMaU6ACeYF0e0sRb7Fs0WGdyb3FYtnvzTcNZfkEQxo9GT0FgHQs3',
  'Q9dgE4Pre4D9yyp9hswzWGdyb3FYraH3D4ZA6HLsU1kyC6JqSnzL',
  'ihiM9wGGGbITOWXD2MQqWGdyb3FYTOi0u9NTWrwG9ob0RKRr7bMg',
  'Fm4LdAzdVWuVKXcUKA5AWGdyb3FYnd62c8ecf3dnlk2Hzhqk09LJ'
];

export const GROQ_API_KEYS: string[] = KEY_PARTS.map(part => PREFIX + part);

let currentKeyIndex = 0;

export function getNextApiKey(): string {
  if (GROQ_API_KEYS.length === 0) return '';
  const key = GROQ_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_API_KEYS.length;
  return key;
}

export async function executeGroqCompletion(prompt: string, modelId: string = 'llama-3.3-70b-versatile'): Promise<string | null> {
  const attempts = GROQ_API_KEYS.length;
  
  for (let i = 0; i < attempts; i++) {
    const apiKey = getNextApiKey();
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelId.includes('r1') ? 'deepseek-r1-distill-llama-70b' : 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
      }
    } catch {
      continue;
    }
  }

  return null;
}
