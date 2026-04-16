import { useState, useRef, useCallback, useEffect } from 'react';
import { saveImage, loadImage } from '../utils/db';

export default function useImageLoader(blockId, setBlockData) {
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [imageLoading, setImageLoading] = useState(false);

  // Hydrate image from IndexedDB on mount
  useEffect(() => {
    if (!blockId) return;
    let cancelled = false;
    setImageLoading(true);

    loadImage(blockId).then((dataUrl) => {
      if (cancelled || !dataUrl) {
        setImageLoading(false);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        setImage(dataUrl);
        setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
        setImageLoading(false);
      };
      img.onerror = () => {
        if (!cancelled) setImageLoading(false);
      };
      img.src = dataUrl;
    }).catch(() => {
      if (!cancelled) setImageLoading(false);
    });

    return () => { cancelled = true; };
  }, [blockId]);

  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(ev.target.result);
        setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
        setBlockData((d) => ({
          ...d,
          source_frame: {
            ...d.source_frame,
            screenshot_loaded: true,
            original_size: { w: img.naturalWidth, h: img.naturalHeight },
          },
        }));
        // Persist to IndexedDB
        if (blockId) {
          saveImage(blockId, ev.target.result);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }, [blockId, setBlockData]);

  const handleImage = useCallback((e) => {
    loadFile(e.target.files?.[0]);
  }, [loadFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  return { fileRef, image, imageSize, imageLoading, handleImage, handleDrop, handleDragOver };
}
