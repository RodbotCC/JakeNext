import { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Image, Crosshair, Square } from 'lucide-react';
import { loadImage } from '../../utils/db';
import MarkdownRenderer from '../shared/MarkdownRenderer';
import Admonition from '../shared/Admonition';
import clsx from 'clsx';
import s from './ManualView.module.css';

function useBlockImage(blockId) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!blockId) return;
    loadImage(blockId).then((dataUrl) => setSrc(dataUrl));
  }, [blockId]);
  return src;
}

function ManualSlide({ block, index, total, id }) {
  const imageSrc = useBlockImage(block.block_id);
  const elements = block.elements || [];
  const notes = block.notes?.keep_mode === 'ai' && block.notes?.ai_refined_note
    ? block.notes.ai_refined_note
    : block.notes?.user_note;
  const actionType = block.action?.type || 'click';
  const appId = block.application?.app_id;

  return (
    <div className={s.slide} id={id}>
      <div className={s.slideNumber}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <h2 className={s.slideTitle}>
        {block.title || 'Untitled Block'}
      </h2>
      <div className={s.slideMeta}>
        {appId && <span className={clsx(s.badge, s.badgePrimary)}>{appId}</span>}
        <span className={clsx(s.badge, s.badgeGold)}>{actionType}</span>
        {elements.length > 0 && (
          <span className={clsx(s.badge, s.badgeGreen)}>{elements.length} elements</span>
        )}
        <span className={clsx(s.badge, s.badgePrimary)}>
          Step {index + 1} of {total}
        </span>
      </div>

      {/* Screenshot */}
      <div className={s.screenshotWrap}>
        {imageSrc ? (
          <img src={imageSrc} alt={block.title || 'Screenshot'} className={s.screenshot} />
        ) : (
          <div className={s.noScreenshot}>
            <Image size={40} strokeWidth={1} />
            <div className={s.noScreenshotText}>
              No screenshot loaded for this block
            </div>
          </div>
        )}
      </div>

      {/* Details grid */}
      <div className={s.details}>
        {/* Elements */}
        {elements.length > 0 && (
          <div className={s.detailCard}>
            <div className={s.detailLabel}>Target Elements</div>
            <div className={s.elementList}>
              {elements.map((el) => (
                <div key={el.element_id} className={s.elementItem}>
                  <span className={s.elementDot} />
                  <span>{el.label || 'Unlabeled'}</span>
                  <span className={s.elementCoords}>
                    ({el.x}, {el.y})
                    {el.w ? ` ${el.w}x${el.h}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className={s.detailCard}>
          <div className={s.detailLabel}>Action</div>
          <div className={s.detailContent}>
            <strong>{actionType}</strong>
            {block.action?.payload && Object.keys(block.action.payload).length > 0 && (
              <pre style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                marginTop: 8,
                background: 'var(--color-surface-alt)',
                padding: 8,
                borderRadius: 'var(--radius-sm)',
                overflow: 'auto',
              }}>
                {JSON.stringify(block.action.payload, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className={clsx(s.detailCard, s.fullWidth)}>
            <div className={s.detailLabel}>
              Operator Notes
              {block.notes?.keep_mode === 'ai' && ' (AI Refined)'}
            </div>
            <div className={s.noteContent}>
              <MarkdownRenderer>{notes}</MarkdownRenderer>
            </div>
          </div>
        )}

        {/* Validation */}
        {(block.validation?.success_conditions?.length > 0 || block.validation?.failure_conditions?.length > 0) && (
          <div className={s.detailCard}>
            <div className={s.detailLabel}>Validation</div>
            <div className={s.detailContent}>
              {block.validation.success_conditions?.map((c, i) => (
                <div key={i} style={{ color: 'var(--color-accent-green)', fontSize: 'var(--text-sm)' }}>
                  + {c}
                </div>
              ))}
              {block.validation.failure_conditions?.map((c, i) => (
                <div key={i} style={{ color: 'var(--color-accent-pink)', fontSize: 'var(--text-sm)' }}>
                  - {c}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManualView({ blocks, flow }) {
  const pageRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Get blocks in flow order (by edges), fallback to node order
  const orderedBlocks = (() => {
    if (!flow?.nodes?.length) return [];

    // Try topological sort from edges
    const nodeIds = flow.nodes.map((n) => n.block_id);
    const edgeMap = {};
    const inDegree = {};
    for (const id of nodeIds) {
      edgeMap[id] = [];
      inDegree[id] = 0;
    }
    for (const edge of flow.edges || []) {
      if (edgeMap[edge.from_block_id]) {
        edgeMap[edge.from_block_id].push(edge.to_block_id);
        if (inDegree[edge.to_block_id] !== undefined) {
          inDegree[edge.to_block_id]++;
        }
      }
    }

    // Kahn's algorithm
    const queue = nodeIds.filter((id) => inDegree[id] === 0);
    const sorted = [];
    while (queue.length > 0) {
      const current = queue.shift();
      sorted.push(current);
      for (const next of edgeMap[current] || []) {
        inDegree[next]--;
        if (inDegree[next] === 0) queue.push(next);
      }
    }

    // Add any remaining (cycles or disconnected)
    for (const id of nodeIds) {
      if (!sorted.includes(id)) sorted.push(id);
    }

    return sorted.map((id) => blocks[id]).filter(Boolean);
  })();

  const scrollToSlide = useCallback((index) => {
    const el = document.getElementById(`manual-slide-${index}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSlide(index);
  }, []);

  // Track which slide is visible
  useEffect(() => {
    if (!pageRef.current || orderedBlocks.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.slideIndex, 10);
            if (!isNaN(idx)) setActiveSlide(idx);
          }
        }
      },
      { root: pageRef.current, threshold: 0.5 }
    );

    for (let i = 0; i < orderedBlocks.length; i++) {
      const el = document.getElementById(`manual-slide-${i}`);
      if (el) {
        el.dataset.slideIndex = i;
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [orderedBlocks.length]);

  if (orderedBlocks.length === 0) {
    return (
      <div className={s.empty}>
        <div className={s.emptyIcon}>
          <BookOpen size={56} strokeWidth={1} />
        </div>
        <h2 className={s.emptyTitle}>Manual View</h2>
        <p className={s.emptyText}>
          Add blocks to the Flow Builder and connect them to see your operating manual here.
          Each block becomes a page in the manual, displayed in execution order.
        </p>
        <Admonition variant="info" title="How it works">
          The manual follows the flow's execution order. Connect blocks A to B to C
          in the Flow Builder, and they'll appear here as a sequential walkthrough.
        </Admonition>
      </div>
    );
  }

  return (
    <div className={s.page} ref={pageRef}>
      <div className={s.header}>
        <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
        <span className={s.headerTitle}>Operating Manual</span>
        <span className={s.headerMeta}>
          {orderedBlocks.length} step{orderedBlocks.length !== 1 ? 's' : ''}
        </span>
        <div className={s.nav}>
          {orderedBlocks.map((_, i) => (
            <button
              key={i}
              className={clsx(s.navDot, activeSlide === i && s.navDotActive)}
              onClick={() => scrollToSlide(i)}
              title={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={s.slides}>
        {orderedBlocks.map((block, i) => (
          <ManualSlide
            key={block.block_id}
            block={block}
            index={i}
            total={orderedBlocks.length}
            id={`manual-slide-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
