import s from './AppShell.module.css';

export default function AppShell({ children }) {
  return <div className={s.shell}>{children}</div>;
}
