import useLocalStorage from './useLocalStorage';
import { colors } from '../tokens/colorValues';

const DEFAULT_TOOL_SETTINGS = {
  mark: { color: colors.primary },
  box: { color: colors.primary },
  arrow: { color: colors.accentGold },
  circle: { color: colors.accentCoral },
  note: { color: colors.accentGold },
  _global: { scale: 1.5 }, // 1 = tiny, 1.5 = default, 2 = medium, 3 = large
};

export const TOOL_PALETTE = [
  { color: colors.primary, label: 'Burgundy' },
  { color: colors.accentGold, label: 'Gold' },
  { color: colors.accentCoral, label: 'Coral' },
  { color: colors.accentGreen, label: 'Sage' },
  { color: colors.accentBlue, label: 'Blue' },
  { color: colors.accentPink, label: 'Rose' },
];

export const SCALE_PRESETS = [
  { value: 1, label: 'S' },
  { value: 1.5, label: 'M' },
  { value: 2, label: 'L' },
  { value: 3, label: 'XL' },
];

export default function useToolSettings() {
  const [settings, setSettings] = useLocalStorage('framed:toolSettings', DEFAULT_TOOL_SETTINGS);

  const setToolColor = (toolId, color) => {
    setSettings((prev) => ({
      ...prev,
      [toolId]: { ...(prev[toolId] || {}), color },
    }));
  };

  const setScale = (scale) => {
    setSettings((prev) => ({
      ...prev,
      _global: { ...(prev._global || {}), scale },
    }));
  };

  const scale = settings._global?.scale || 1.5;

  return [settings, setToolColor, scale, setScale];
}
