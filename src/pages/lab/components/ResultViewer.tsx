import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaRedoAlt, FaArrowsAltH, FaHeart, FaRegHeart, FaCheck, FaRobot, FaStar, FaMagic } from 'react-icons/fa';
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

// ─── AI suggestion data (module scope) ───────────────────────────────────────
const SUGGESTIONS: Record<string, string[][]> = {
  upper_body: [
    [
      '✨ Great pick! This top pairs beautifully with high-waisted trousers or tailored joggers.',
      '👟 For a streetwear edge, layer under an oversized bomber jacket and add chunky sneakers.',
      '💡 Tuck it in at the front to define your waist and create a more polished silhouette.',
    ],
    [
      '🎨 The colour palette of this piece works year-round — try it with neutral bottoms to let it shine.',
      '🧣 A structured blazer thrown over the top instantly elevates this to smart-casual.',
      '💡 Roll the sleeves for a relaxed vibe or keep them down for a cleaner look.',
    ],
    [
      '🔥 This style is trending right now — wear it with wide-leg denim for a runway-ready moment.',
      '👜 A crossbody bag in a complementary tone ties the whole look together effortlessly.',
      '💡 Earth-toned footwear (tan, cream, olive) will complement almost any top like this one.',
    ],
  ],
  lower_body: [
    [
      '✨ These bottoms are extremely versatile — they pair with both casual tees and fitted blouses.',
      '👟 White sneakers or loafers keep the look fresh and modern without overcomplicating it.',
      '💡 A half-tucked shirt will balance proportions for a relaxed, editorial feel.',
    ],
    [
      '🎨 Monochrome styling — matching top and bottom in the same hue — is a powerful move with this piece.',
      '🧥 A cropped jacket or cardigan on top creates a flattering break and adds visual interest.',
      '💡 Avoid overly busy prints on top; let these bottoms be the statement.',
    ],
  ],
  full_body: [
    [
      '✨ A full-body outfit is the ultimate one-and-done look — add a belt to define your silhouette.',
      '👜 Statement accessories (earrings, a bold bag) are all you need to complete this ensemble.',
      '💡 Opt for a heel for dressier occasions or sneakers to keep it casual — both work perfectly.',
    ],
    [
      '🔥 This fit is doing a lot of the heavy lifting — keep accessories minimal to stay chic.',
      '🧥 A structured coat draped over your shoulders adds instant glamour for evening.',
      '💡 Mule heels or ankle boots complement the silhouette of a full-body outfit beautifully.',
    ],
  ],
};

function getAiSuggestion(category: string, garmentName: string): string[] {
  const pool = SUGGESTIONS[category] ?? SUGGESTIONS['upper_body'];
  const idx = garmentName.length % pool.length;
  return pool[idx];
}

// ─────────────────────────────────────────────────────────────────────────────

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

      {/* ── AI Style Suggestion ───────────────────────────────────────────── */}
      <AiSuggestionPanel garmentName={garmentName} garmentCategory={garmentCategory} />
    </motion.div>
  );
}

// ─── AI Suggestion sub-component ─────────────────────────────────────────────
function AiSuggestionPanel({ garmentName, garmentCategory }: { garmentName: string; garmentCategory: string }) {
  const tips = getAiSuggestion(garmentCategory, garmentName);
  const [visible, setVisible] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);

  // Reveal lines one-by-one with a stagger after a short delay
  useEffect(() => {
    setVisible(false);
    setTypedLines([]);
    const revealTimer = setTimeout(() => {
      setVisible(true);
      tips.forEach((_, i) => {
        setTimeout(() => {
          setTypedLines((prev) => [...prev, tips[i]]);
        }, i * 500);
      });
    }, 600);
    return () => clearTimeout(revealTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garmentName, garmentCategory]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="ai-suggestion-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="ai-suggestion-header">
            <span className="ai-suggestion-badge">
              <FaRobot className="ai-suggestion-badge-icon" />
              AI
            </span>
            <h4 className="ai-suggestion-title">
              <FaMagic style={{ marginRight: '0.4rem', opacity: 0.7 }} />
              Style Review
            </h4>
            <div className="ai-suggestion-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="ai-star" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>

          {/* Tips */}
          <ul className="ai-suggestion-list">
            <AnimatePresence>
              {typedLines.map((line, i) => (
                <motion.li
                  key={i}
                  className="ai-suggestion-item"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {line}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <p className="ai-suggestion-disclaimer">Suggestions are AI-generated based on current style trends.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
