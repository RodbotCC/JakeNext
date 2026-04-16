import clsx from 'clsx';
import s from './IconButton.module.css';

export default function IconButton({ icon: Icon, size = 16, variant, label, className, ...props }) {
  return (
    <button
      className={clsx(s.button, variant && s[variant], className)}
      aria-label={label}
      {...props}
    >
      <Icon size={size} />
    </button>
  );
}
