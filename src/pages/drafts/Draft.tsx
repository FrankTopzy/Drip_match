import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileAlt, FaTrashAlt, FaExpand, FaTimes, FaDownload, FaHeart } from 'react-icons/fa';
import { useDripmatch } from '../../components/Context';
import type { SavedResult } from '../../components/types';
import './draft.css';

function Draft() {
  const { drafts, removeDraft, clearDrafts, moveDraftToFavorite } = useDripmatch();
  const [selectedResult, setSelectedResult] = useState<SavedResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDownload = async (item: SavedResult) => {
    try {
      const response = await fetch(item.resultImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drip-match-${item.garmentName.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(item.resultImageUrl, '_blank');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="draft-page">
      {/* Header */}
      <motion.div
        className="draft-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="draft-title">
          <FaFileAlt className="draft-title-icon" />
          Drafts
        </h1>
        <p className="draft-subtitle">
          Try-on results you skipped without saving to favorites. Review them here and decide.
        </p>
      </motion.div>

      {/* Stats bar */}
      {drafts.length > 0 && (
        <motion.div
          className="draft-stats-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="draft-count">
            {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
          </span>
          <button
            className="draft-clear-btn"
            onClick={() => setShowClearConfirm(true)}
          >
            <FaTrashAlt /> Clear All
          </button>
        </motion.div>
      )}

      {/* Clear confirmation modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="modal-title">Clear All Drafts?</h3>
              <p className="modal-desc">
                This will permanently remove all {drafts.length} draft results. This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn--cancel"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn modal-btn--danger"
                  onClick={() => {
                    clearDrafts();
                    setShowClearConfirm(false);
                  }}
                >
                  <FaTrashAlt /> Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {drafts.length > 0 ? (
        <motion.div
          className="draft-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {drafts.map((item: any, index:number) => (
            <motion.div
              key={item.id}
              className="draft-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              layout
            >
              <div className="draft-badge">Draft</div>
              <div className="draft-card-img-wrap" onClick={() => setSelectedResult(item)}>
                <img src={item.resultImageUrl} alt={item.garmentName} className="draft-card-img" />
                <div className="draft-card-overlay">
                  <FaExpand className="draft-card-expand" />
                </div>
              </div>
              <div className="draft-card-info">
                <p className="draft-card-name">{item.garmentName}</p>
                <p className="draft-card-meta">
                  {item.garmentCategory.replace('_', ' ')}
                  {item.garmentPrice && ` · ${item.garmentPrice}`}
                </p>
                <p className="draft-card-date">{formatDate(item.savedAt)}</p>
              </div>
              <div className="draft-card-actions">
                <button
                  className="draft-card-btn draft-card-btn--fav"
                  onClick={() => moveDraftToFavorite(item.id)}
                  title="Move to Favorites"
                >
                  <FaHeart /> Favorite
                </button>
                <button
                  className="draft-card-btn draft-card-btn--download"
                  onClick={() => handleDownload(item)}
                  title="Download"
                >
                  <FaDownload />
                </button>
                <button
                  className="draft-card-btn draft-card-btn--remove"
                  onClick={() => removeDraft(item.id)}
                  title="Delete draft"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="draft-empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="draft-empty-icon">📝</div>
          <h3 className="draft-empty-title">No drafts</h3>
          <p className="draft-empty-text">
            When you click "Try Another" without adding to favorites, results are automatically saved here as drafts.
          </p>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setSelectedResult(null)}>
                <FaTimes />
              </button>
              <img
                src={selectedResult.resultImageUrl}
                alt={selectedResult.garmentName}
                className="lightbox-img"
              />
              <div className="lightbox-info">
                <p className="lightbox-name">{selectedResult.garmentName}</p>
                <p className="lightbox-meta">
                  {selectedResult.garmentCategory.replace('_', ' ')}
                  {selectedResult.garmentPrice && ` · ${selectedResult.garmentPrice}`}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Draft;
