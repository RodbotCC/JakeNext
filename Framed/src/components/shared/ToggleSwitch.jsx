import clsx from 'clsx';
import s from './ToggleSwitch.module.css';

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className={s.wrapper} onClick={() => onChange(!checked)}>
      <div className={clsx(s.track, checked && s.trackOn)}>
        <div className={clsx(s.thumb, checked && s.thumbOn)} />
      </div>
      {label && <span className={s.label}>{label}</span>}
    </div>
  );
}
