import { useMemo } from 'react';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  Shield,
  Crosshair,
  Target,
  Activity,
} from 'lucide-react';
import { StatCard } from '../shared/WidgetCard';
import Admonition from '../shared/Admonition';
import RelationshipList from './RelationshipList';
import s from './Statistics.module.css';

const FEATURES = [
  { icon: Target, text: 'Block success/failure rates' },
  { icon: TrendingUp, text: 'Confidence scoring' },
  { icon: Shield, text: 'Audit pass rate tracking' },
  { icon: Activity, text: 'Score history over time' },
  { icon: BarChart3, text: 'Strategy performance comparison' },
];

export default function Statistics({ blocks = {} }) {
  const stats = useMemo(() => {
    const blockList = Object.values(blocks);
    const totalElements = blockList.reduce(
      (sum, b) => sum + (b.elements || []).length, 0
    );
    const actionTypes = new Set(
      blockList.map((b) => b.action?.type).filter(Boolean)
    );
    const withValidation = blockList.filter(
      (b) =>
        (b.validation?.success_conditions?.length > 0) ||
        (b.validation?.failure_conditions?.length > 0)
    ).length;
    const withAudit = blockList.filter((b) => b.audit?.enabled).length;

    return [
      { icon: <BarChart3 size={20} />, value: String(blockList.length), label: 'Blocks Created' },
      { icon: <Crosshair size={20} />, value: String(totalElements), label: 'Elements Indexed' },
      { icon: <CheckCircle2 size={20} />, value: String(actionTypes.size), label: 'Action Types Used' },
      { icon: <Shield size={20} />, value: String(withValidation), label: 'With Validation' },
      { icon: <XCircle size={20} />, value: String(withAudit), label: 'With Audit' },
      { icon: <Clock size={20} />, value: '--', label: 'Avg Execution Time' },
    ];
  }, [blocks]);

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.iconWrap}>
            <BarChart3 size={56} strokeWidth={1} />
          </div>
          <h2 className={s.title}>Statistics & Performance</h2>
          <p className={s.description}>
            Track success rates, audit scores, and execution history across every block.
            The manual becomes operationally intelligent as blocks accumulate performance data.
          </p>
        </div>

        <div className={s.grid}>
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>

        <Admonition variant="tip" title="Getting Started">
          Create and compile blocks in the Block Builder to start accumulating performance data here.
        </Admonition>

        <RelationshipList blocks={blocks} />

        <div className={s.featureCard} style={{ marginTop: 20 }}>
          {FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} className={s.featureItem}>
              <span className={s.featureIcon}><Icon size={16} /></span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
