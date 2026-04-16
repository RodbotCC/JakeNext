import { Layers, GitBranch, BarChart3, BookOpen, Settings } from 'lucide-react';
import clsx from 'clsx';
import s from './TabNav.module.css';

const TAB_ICONS = {
  builder: Layers,
  flow: GitBranch,
  manual: BookOpen,
  stats: BarChart3,
  settings: Settings,
};

export default function TabNav({ tabs, active, onChange }) {
  return (
    <nav className={s.nav}>
      {tabs.map((t) => {
        const Icon = TAB_ICONS[t.id];
        return (
          <button
            key={t.id}
            className={clsx(s.tab, active === t.id && s.active)}
            onClick={() => onChange(t.id)}
          >
            {Icon && <Icon size={15} />}
            {t.label}
          </button>
        );
      })}
      <div className={s.spacer} />
      <div className={s.brand}>Framed</div>
    </nav>
  );
}
