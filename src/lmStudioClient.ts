
const API_BASE = 'http://localhost:1234/v1';

export const fetchModels = async () => {
  const response = await fetch(`${API_BASE}/models`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const describeImage = async (base64Image: string, isShort: boolean, langCode: string) => {
  const langMap: Record<string, string> = { 
    de: "German", 
    en: "English", 
    hu: "Hungarian" 
  };
  const targetLanguage = langMap[langCode] || "English";

  const systemPrompt = `You are an expert digital archivist and corporate metadata generator. Your task is to analyze images deeply. 
CRITICAL RULES:
1. BRAND AWARENESS: If a prominent company logo, brand name, or text is visible (e.g., on a wall, sign, or product), you MUST explicitly name it in the title and description.
2. If the image contains a specific scientific entity or historical artifact, identify it by its exact name.
ALL text values MUST be written in ${targetLanguage}.`;

  const shortPrompt = `Analyze this image. 
1. "title": A concise title (approx. 5-12 words). It MUST include prominent brand names or logos visible in the image.
2. "keywords": Provide 8-12 search keywords. Include specific brand names, broad categories, and relevant concepts.
Language: ${targetLanguage}.`;

  const longPrompt = `Analyze this image.
1. "title": A concise title (approx. 5-12 words). It MUST include prominent brand names or logos visible in the image.
2. "description": A precise description in exactly 2 to 3 sentences. Describe the setting, the atmosphere, the people (if any), and explicitly name any prominent brands or logos shown on walls or objects.
3. "objects": A list of all notable elements (e.g., furniture, plants, logos, people).
4. "keywords": 15-20 highly specific search keywords, including the brand name, setting, mood, and objects.
Language: ${targetLanguage}.`;

  const shortSchema = {
    type: "object",
    properties: {
      title: { type: "string" },
      keywords: { type: "array", items: { type: "string" } }
    },
    required: ["title", "keywords"]
  };

  const longSchema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      objects: { type: "array", items: { type: "string" } },
      keywords: { type: "array", items: { type: "string" } }
    },
    required: ["title", "description", "objects", "keywords"]
  };

  const payload = {
    model: "local-model",
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: [
          { type: "text", text: isShort ? shortPrompt : longPrompt },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: isShort ? "short_image_metadata" : "long_image_metadata",
        strict: true,
        schema: isShort ? shortSchema : longSchema
      }
    }
  };

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error("Failed to connect to LM Studio");
  }
  
  const data = await response.json();
  const rawContent = data.choices[0].message.content;
  
  try {
    return JSON.parse(rawContent);
  } catch (e) {
    console.error("Failed to parse JSON from LLM response. Raw output:", rawContent);
    throw new Error("LLM did not return valid JSON", { cause: e });
  }
};
