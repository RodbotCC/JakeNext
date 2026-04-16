import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import s from './CollapsibleSection.module.css';

export default function CollapsibleSection({
  title,
  icon: Icon,
  badge,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children, open]);

  return (
    <div className={s.section}>
      <div className={s.header} onClick={() => setOpen(!open)}>
        <ChevronRight
          size={14}
          className={clsx(s.chevron, open && s.chevronOpen)}
        />
        {Icon && <Icon size={14} className={s.icon} />}
        <span className={s.label}>{title}</span>
        {badge != null && <span className={s.badge}>{badge}</span>}
      </div>
      <div
        className={clsx(s.body, open ? s.bodyOpen : s.bodyClosed)}
        style={open ? { maxHeight: height + 16 } : undefined}
      >
        <div ref={contentRef} className={s.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
