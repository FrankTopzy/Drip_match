import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTrashAlt, FaExpand, FaTimes, FaDownload } from 'react-icons/fa';
import { useDripmatch } from '../../components/Context';
import type { SavedResult } from '../../components/types';
import './favorite.css';

function Favorite() {
  const { favorites, removeFavorite, clearFavorites } = useDripmatch();
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
    <div className="fav-page">
      {/* Header */}
      <motion.div
        className="fav-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="fav-title">
          <FaHeart className="fav-title-icon" />
          Favorites
        </h1>
        <p className="fav-subtitle">
          Your curated collection of try-on looks you loved.
        </p>
      </motion.div>

      {/* Stats bar */}
      {favorites.length > 0 && (
        <motion.div
          className="fav-stats-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="fav-count">
            {favorites.length} {favorites.length === 1 ? 'look' : 'looks'} saved
          </span>
          <button
            className="fav-clear-btn"
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
              <h3 className="modal-title">Clear All Favorites?</h3>
              <p className="modal-desc">
                This will permanently remove all {favorites.length} saved looks. This action cannot be undone.
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
                    clearFavorites();
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
      {favorites.length > 0 ? (
        <motion.div
          className="fav-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {favorites.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              className="fav-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              layout
            >
              <div className="fav-card-img-wrap" onClick={() => setSelectedResult(item)}>
                <img src={item.resultImageUrl} alt={item.garmentName} className="fav-card-img" />
                <div className="fav-card-overlay">
                  <FaExpand className="fav-card-expand" />
                </div>
              </div>
              <div className="fav-card-info">
                <p className="fav-card-name">{item.garmentName}</p>
                <p className="fav-card-meta">
                  {item.garmentCategory.replace('_', ' ')}
                  {item.garmentPrice && ` · ${item.garmentPrice}`}
                </p>
                <p className="fav-card-date">{formatDate(item.savedAt)}</p>
              </div>
              <div className="fav-card-actions">
                <button
                  className="fav-card-btn fav-card-btn--download"
                  onClick={() => handleDownload(item)}
                  title="Download"
                >
                  <FaDownload />
                </button>
                <button
                  className="fav-card-btn fav-card-btn--remove"
                  onClick={() => removeFavorite(item.id)}
                  title="Remove from favorites"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="fav-empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="fav-empty-icon">💖</div>
          <h3 className="fav-empty-title">No favorites yet</h3>
          <p className="fav-empty-text">
            When you love a try-on result, hit the heart button to save it here.
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

export default Favorite;
