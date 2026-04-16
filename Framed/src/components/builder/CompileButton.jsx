import { useState } from 'react';
import { Zap, X } from 'lucide-react';
import PillButton from '../shared/PillButton';
import JsonPreview from '../shared/JsonPreview';
import { compileBlock } from '../../utils/compile';
import s from './CompileButton.module.css';

export default function CompileButton({ blockData, noteInput }) {
  const [showJson, setShowJson] = useState(false);

  return (
    <>
      <div className={s.footer}>
        <PillButton
          full
          variant={showJson ? 'secondary' : 'primary'}
          onClick={() => setShowJson(!showJson)}
        >
          {showJson ? <X size={14} /> : <Zap size={14} />}
          {showJson ? 'Close JSON Preview' : 'Compile Block'}
        </PillButton>
      </div>
      {showJson && (
        <div className={s.jsonPanel}>
          <JsonPreview data={compileBlock(blockData, noteInput)} />
        </div>
      )}
    </>
  );
}
