import clsx from 'clsx';
import s from './FormField.module.css';

export function FormField({ label, children, className }) {
  return (
    <div className={clsx(s.field, className)}>
      {label && <label className={s.label}>{label}</label>}
      {children}
    </div>
  );
}

export function FormInput({ className, ...props }) {
  return <input className={clsx(s.input, className)} {...props} />;
}

export function FormSelect({ children, className, ...props }) {
  return (
    <select className={clsx(s.input, className)} {...props}>
      {children}
    </select>
  );
}

export function FormTextarea({ className, ...props }) {
  return <textarea className={clsx(s.input, className)} {...props} />;
}

export function FormRow({ children }) {
  return <div className={s.row}>{children}</div>;
}
