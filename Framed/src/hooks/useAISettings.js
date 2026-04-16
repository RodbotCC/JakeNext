import useLocalStorage from './useLocalStorage';

// Model registry — all available models organized by capability
export const AI_MODELS = {
  text: {
    label: 'Text Generation',
    models: [
      { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano', description: 'Fastest, cheapest' },
      { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini', description: 'Balanced speed & quality' },
      { id: 'gpt-5.4', label: 'GPT-5.4', description: 'Most capable' },
    ],
  },
  image: {
    label: 'Image Generation',
    models: [
      { id: 'gpt-image-1-mini', label: 'GPT Image Mini', description: 'Fast, affordable' },
      { id: 'gpt-image-1.5-2025-12-16', label: 'GPT Image 1.5', description: 'Highest quality' },
    ],
  },
  tts: {
    label: 'Text-to-Speech',
    models: [
      { id: 'gpt-4o-mini-tts-2025-12-15', label: 'GPT-4o Mini TTS', description: 'Voice output for automations' },
    ],
  },
  transcription: {
    label: 'Transcription',
    models: [
      { id: 'gpt-4o-mini-transcribe-2025-12-15', label: 'GPT-4o Mini Transcribe', description: 'Audio to text' },
    ],
  },
};

const DEFAULT_SETTINGS = {
  apiKey: '',
  textModel: 'gpt-5.4-mini',
  imageModel: 'gpt-image-1-mini',
  ttsModel: 'gpt-4o-mini-tts-2025-12-15',
  transcriptionModel: 'gpt-4o-mini-transcribe-2025-12-15',
};

export default function useAISettings() {
  return useLocalStorage('framed:aiSettings', DEFAULT_SETTINGS);
}
