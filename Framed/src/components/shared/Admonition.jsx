import { Info, AlertTriangle, Lightbulb, FileText } from 'lucide-react';
import clsx from 'clsx';
import s from './Admonition.module.css';

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  note: FileText,
};

export default function Admonition({ variant = 'info', title, children }) {
  const Icon = ICONS[variant] || Info;
  return (
    <div className={clsx(s.admonition, s[variant])}>
      <div className={s.icon}><Icon size={16} /></div>
      <div className={s.content}>
        {title && <div className={s.title}>{title}</div>}
        {children}
      </div>
    </div>
  );
}
