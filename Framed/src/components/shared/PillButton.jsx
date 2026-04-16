import clsx from 'clsx';
import s from './PillButton.module.css';

export default function PillButton({
  children,
  variant = 'primary',
  size,
  full,
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        s.button,
        s[variant],
        size && s[size],
        full && s.full,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
