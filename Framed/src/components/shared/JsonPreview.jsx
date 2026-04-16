import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import s from './JsonPreview.module.css';

export default function JsonPreview({ data }) {
  const json = JSON.stringify(data, null, 2);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={s.wrapper}>
      <button
        onClick={handleCopy}
        className={clsx(s.copyButton, copied && s.copied)}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className={s.pre}>{json}</pre>
    </div>
  );
}
