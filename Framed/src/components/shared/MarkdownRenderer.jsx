import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import s from './MarkdownRenderer.module.css';

export default function MarkdownRenderer({ children }) {
  return (
    <div className={s.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
