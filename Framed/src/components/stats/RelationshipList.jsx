import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getTopPairs } from '../../utils/relationships';
import s from './RelationshipList.module.css';

export default function RelationshipList({ blocks }) {
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    getTopPairs(8).then(setPairs);
  }, [blocks]);

  return (
    <div className={s.section}>
      <h3 className={s.title}>Block Relationships</h3>
      {pairs.length === 0 ? (
        <div className={s.empty}>
          Connect blocks in the Flow Builder and record runs to build the relationship graph.
        </div>
      ) : (
        <div className={s.list}>
          {pairs.map((edge) => {
            const source = blocks[edge.source_id];
            const target = blocks[edge.target_id];
            return (
              <div key={edge.edge_id} className={s.pairCard}>
                <span className={s.blockName}>
                  {source?.title || edge.source_id.slice(0, 6)}
                </span>
                <ArrowRight size={14} className={s.arrow} />
                <span className={s.blockName}>
                  {target?.title || edge.target_id.slice(0, 6)}
                </span>
                <div className={s.stats}>
                  <span className={`${s.stat} ${s.statTransitions}`}>
                    {edge.transition_count}x
                  </span>
                  {edge.success_count > 0 && (
                    <span className={`${s.stat} ${s.statSuccess}`}>
                      {edge.success_count} ok
                    </span>
                  )}
                  {edge.failure_count > 0 && (
                    <span className={`${s.stat} ${s.statFailure}`}>
                      {edge.failure_count} fail
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
