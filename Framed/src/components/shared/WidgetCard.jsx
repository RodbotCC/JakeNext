import clsx from 'clsx';
import s from './WidgetCard.module.css';

const BADGE_COLORS = {
  green: s.badgeGreen,
  gold: s.badgeGold,
  coral: s.badgeCoral,
  blue: s.badgeBlue,
  primary: s.badgePrimary,
};

export default function WidgetCard({
  icon,
  title,
  subtitle,
  badges,
  selected,
  onClick,
  actions,
  children,
  large,
  className,
}) {
  return (
    <div
      className={clsx(
        s.card,
        onClick && s.clickable,
        selected && s.selected,
        large && s.large,
        className,
      )}
      onClick={onClick}
    >
      {icon && <div className={s.iconSlot}>{icon}</div>}
      <div className={s.content}>
        {title && <div className={s.title}>{title}</div>}
        {subtitle && <div className={s.subtitle}>{subtitle}</div>}
        {badges && badges.length > 0 && (
          <div className={s.badges}>
            {badges.map((b, i) => (
              <span key={i} className={clsx(s.badge, BADGE_COLORS[b.color] || s.badgePrimary)}>
                {b.label}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  );
}

export function StatCard({ icon, value, label, className }) {
  return (
    <div className={clsx(s.card, s.large, className)}>
      {icon && <div className={s.iconSlot}>{icon}</div>}
      <div className={s.content}>
        <div className={s.largeValue}>{value}</div>
        <div className={s.largeLabel}>{label}</div>
      </div>
    </div>
  );
}
