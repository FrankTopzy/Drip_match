import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaRedoAlt, FaArrowsAltH, FaHeart, FaRegHeart, FaCheck } from 'react-icons/fa';
import { useDripmatch } from '../../../components/Context';
import type { SavedResult } from '../../../components/types';

interface ResultViewerProps {
  originalPhotoUrl: string;
  resultImageUrl: string;
  garmentName: string;
  garmentCategory?: string;
  garmentPrice?: string;
  garmentImageUrl?: string;
  onTryAnother: () => void;
}

export default function ResultViewer({
  originalPhotoUrl,
  resultImageUrl,
  garmentName,
  garmentCategory = '',
  garmentPrice = '',
  garmentImageUrl = '',
  onTryAnother,
}: ResultViewerProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFavConfirm, setShowFavConfirm] = useState(false);

  const { addFavorite, addDraft } = useDripmatch();

  const buildSavedResult = useCallback((): SavedResult => ({
    id: `result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    resultImageUrl,
    originalPhotoUrl,
    garmentName,
    garmentCategory,
    garmentPrice,
    garmentImageUrl,
    savedAt: Date.now(),
  }), [resultImageUrl, originalPhotoUrl, garmentName, garmentCategory, garmentPrice, garmentImageUrl]);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      updateSlider(e.clientX);
    },
    [updateSlider],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updateSlider(e.touches[0].clientX);
    },
    [updateSlider],
  );

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(resultImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drip-match-${garmentName.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultImageUrl, '_blank');
    }
  }, [resultImageUrl, garmentName]);

  const handleAddToFavorites = useCallback(() => {
    const saved = buildSavedResult();
    addFavorite(saved);
    setIsFavorited(true);
    setShowFavConfirm(true);
    setTimeout(() => setShowFavConfirm(false), 2000);
  }, [addFavorite, buildSavedResult]);

  const handleTryAnother = useCallback(() => {
    // If not favorited, auto-save to drafts
    if (!isFavorited) {
      const saved = buildSavedResult();
      addDraft(saved);
    }
    onTryAnother();
  }, [isFavorited, buildSavedResult, addDraft, onTryAnother]);

  return (
    <motion.div
      className="result-viewer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="section-label">Your Virtual Try-On</h3>

      {/* Before/After comparison slider */}
      <div
        ref={containerRef}
        className="comparison-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* "After" image — full width underneath */}
        <img src={resultImageUrl} alt="Try-on result" className="comparison-img comparison-img--after" />

        {/* "Before" image — clipped by slider */}
        <div
          className="comparison-before-clip"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalPhotoUrl}
            alt="Original photo"
            className="comparison-img comparison-img--before"
          />
          <span className="comparison-label comparison-label--before">Before</span>
        </div>

        <span
          className="comparison-label comparison-label--after"
          style={{ right: `${100 - sliderPosition > 15 ? 100 - sliderPosition - 5 : 2}%` }}
        >
          After
        </span>

        {/* Slider handle */}
        <div
          className="comparison-slider-line"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="comparison-slider-handle">
            <FaArrowsAltH />
          </div>
        </div>
      </div>

      {/* Favorite confirmation toast */}
      <AnimatePresence>
        {showFavConfirm && (
          <motion.div
            className="fav-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FaCheck /> Added to Favorites!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="result-actions">
        <button
          className={`result-btn ${isFavorited ? 'result-btn--favorited' : 'result-btn--favorite'}`}
          onClick={handleAddToFavorites}
          disabled={isFavorited}
        >
          {isFavorited ? <><FaHeart /> Favorited</> : <><FaRegHeart /> Add to Favorites</>}
        </button>
        <button className="result-btn result-btn--download" onClick={handleDownload}>
          <FaDownload /> Save Result
        </button>
        <button className="result-btn result-btn--retry" onClick={handleTryAnother}>
          <FaRedoAlt /> Try Another
        </button>
      </div>

      {!isFavorited && (
        <p className="draft-hint">
          💡 Clicking "Try Another" without adding to favorites will save this result to your Drafts.
        </p>
      )}
    </motion.div>
  );
}
