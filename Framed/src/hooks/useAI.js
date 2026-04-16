import { useState, useCallback } from 'react';

const API_BASE = 'https://api.openai.com/v1';

// Generic Responses API call
async function callResponses(apiKey, { model, instructions, input, reasoning }) {
  const body = { model, input };
  if (instructions) body.instructions = instructions;
  if (reasoning) body.reasoning = reasoning;

  const res = await fetch(`${API_BASE}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

// Extract text from Responses API output
function extractText(response) {
  if (response.output_text) return response.output_text;
  // Walk the output array looking for text content
  for (const item of response.output || []) {
    if (item.type === 'message' && item.content) {
      for (const block of item.content) {
        if (block.type === 'output_text' && block.text) {
          return block.text;
        }
      }
    }
  }
  return null;
}

export default function useAI(settings) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refine operator notes into polished documentation
  const refineNotes = useCallback(async ({ userNote, blockContext }) => {
    if (!settings?.apiKey) {
      setError('No API key configured. Add your OpenAI key in the AI Settings panel.');
      return null;
    }
    if (!userNote?.trim()) {
      setError('No notes to refine.');
      return null;
    }

    setLoading(true);
    setError(null);

    const contextLines = [
      blockContext.application?.app_id && `Application: ${blockContext.application.app_id}`,
      blockContext.application?.screen_name && `Screen: ${blockContext.application.screen_name}`,
      blockContext.action?.type && `Action type: ${blockContext.action.type}`,
      blockContext.elements?.length > 0 && `Elements: ${blockContext.elements.map((e) => e.label || 'unlabeled').join(', ')}`,
    ].filter(Boolean).join('\n');

    try {
      const response = await callResponses(settings.apiKey, {
        model: settings.textModel || 'gpt-5.4-mini',
        instructions: `You are an expert technical writer helping document UI automation steps. Your job is to take the operator's rough notes about a screen frame and refine them into clear, structured documentation. Be concise but thorough. Use markdown formatting. Preserve the operator's intent exactly — do not invent steps or add assumptions. Output only the refined documentation, no preamble.`,
        input: `Here is the context for this automation block:\n${contextLines}\n\nHere are the operator's notes to refine:\n${userNote}`,
      });

      const refined = extractText(response);
      setLoading(false);
      return refined;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [settings]);

  // Generate text (general purpose)
  const generateText = useCallback(async ({ instructions, input, reasoning }) => {
    if (!settings?.apiKey) {
      setError('No API key configured.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await callResponses(settings.apiKey, {
        model: settings.textModel || 'gpt-5.4-mini',
        instructions,
        input,
        reasoning,
      });

      const text = extractText(response);
      setLoading(false);
      return text;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [settings]);

  // Image generation scaffold
  const generateImage = useCallback(async ({ prompt, size = '1024x1024', quality = 'medium' }) => {
    if (!settings?.apiKey) {
      setError('No API key configured.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.imageModel || 'gpt-image-1-mini',
          prompt,
          size,
          quality,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      setLoading(false);
      return data.data?.[0]; // { url, b64_json, revised_prompt }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [settings]);

  // Text-to-speech scaffold
  const textToSpeech = useCallback(async ({ text, voice = 'coral', speed = 1.0 }) => {
    if (!settings?.apiKey) {
      setError('No API key configured.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.ttsModel || 'gpt-4o-mini-tts-2025-12-15',
          input: text,
          voice,
          speed,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setLoading(false);
      return { blob, url }; // Caller can play with new Audio(url)
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [settings]);

  // Transcription scaffold
  const transcribe = useCallback(async ({ audioFile }) => {
    if (!settings?.apiKey) {
      setError('No API key configured.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', settings.transcriptionModel || 'gpt-4o-mini-transcribe-2025-12-15');

      const res = await fetch(`${API_BASE}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      setLoading(false);
      return data.text;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [settings]);

  return {
    // Note refinement (wired)
    refineNotes,
    // General text generation (scaffolded)
    generateText,
    // Image generation (scaffolded)
    generateImage,
    // Text-to-speech (scaffolded)
    textToSpeech,
    // Transcription (scaffolded)
    transcribe,
    // State
    loading,
    error,
    clearError: () => setError(null),
  };
}
