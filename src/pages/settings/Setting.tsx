import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog, FaMoon, FaSun, FaTrashAlt, FaHeart, FaFileAlt, FaSave, FaInfoCircle, FaFlask, FaGithub } from 'react-icons/fa';
import { useDripmatch } from '../../components/Context';
import './setting.css';

function Setting() {
  const {
    isDark,
    setIsDark,
    favorites,
    drafts,
    clearFavorites,
    clearDrafts,
    autoSaveDrafts,
    setAutoSaveDrafts,
  } = useDripmatch();

  const [showClearFavConfirm, setShowClearFavConfirm] = useState(false);
  const [showClearDraftConfirm, setShowClearDraftConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const handleClearAll = () => {
    clearFavorites();
    clearDrafts();
    setShowClearAllConfirm(false);
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <motion.div
        className="settings-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="settings-title">
          <FaCog className="settings-title-icon" />
          Settings
        </h1>
        <p className="settings-subtitle">
          Customize your DripMatch experience.
        </p>
      </motion.div>

      <div className="settings-content">
        {/* Appearance Section */}
        <motion.section
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h2 className="settings-section-title">
            <span className="settings-section-icon">🎨</span>
            Appearance
          </h2>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">
                {isDark ? <FaMoon className="settings-item-icon" /> : <FaSun className="settings-item-icon" />}
                Theme
              </div>
              <p className="settings-item-desc">
                Switch between dark and light mode.
              </p>
            </div>
            <button
              className={`toggle-switch ${isDark ? 'toggle-switch--on' : ''}`}
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle dark mode"
            >
              <div className="toggle-knob">
                {isDark ? <FaMoon className="toggle-icon" /> : <FaSun className="toggle-icon" />}
              </div>
            </button>
          </div>
        </motion.section>

        {/* Behavior Section */}
        <motion.section
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="settings-section-title">
            <span className="settings-section-icon">⚙️</span>
            Behavior
          </h2>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">
                <FaSave className="settings-item-icon" />
                Auto-save Drafts
              </div>
              <p className="settings-item-desc">
                Automatically save try-on results to drafts when you click "Try Another" without favoriting.
              </p>
            </div>
            <button
              className={`toggle-switch ${autoSaveDrafts ? 'toggle-switch--on' : ''}`}
              onClick={() => setAutoSaveDrafts(!autoSaveDrafts)}
              aria-label="Toggle auto-save drafts"
            >
              <div className="toggle-knob" />
            </button>
          </div>
        </motion.section>

        {/* Storage Section */}
        <motion.section
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="settings-section-title">
            <span className="settings-section-icon">💾</span>
            Storage
          </h2>

          <div className="settings-storage-overview">
            <div className="storage-stat">
              <FaHeart className="storage-stat-icon storage-stat-icon--fav" />
              <div>
                <span className="storage-stat-value">{favorites.length}</span>
                <span className="storage-stat-label">{favorites.length === 1 ? 'Favorite' : 'Favorites'}</span>
              </div>
            </div>
            <div className="storage-divider" />
            <div className="storage-stat">
              <FaFileAlt className="storage-stat-icon storage-stat-icon--draft" />
              <div>
                <span className="storage-stat-value">{drafts.length}</span>
                <span className="storage-stat-label">{drafts.length === 1 ? 'Draft' : 'Drafts'}</span>
              </div>
            </div>
          </div>

          <div className="settings-item settings-item--action">
            <div className="settings-item-info">
              <div className="settings-item-label">
                <FaHeart className="settings-item-icon" style={{ color: '#ec4899' }} />
                Clear Favorites
              </div>
              <p className="settings-item-desc">
                Remove all saved favorite looks.
              </p>
            </div>
            <button
              className="settings-action-btn settings-action-btn--danger"
              onClick={() => setShowClearFavConfirm(true)}
              disabled={favorites.length === 0}
            >
              <FaTrashAlt /> Clear
            </button>
          </div>

          <div className="settings-item settings-item--action">
            <div className="settings-item-info">
              <div className="settings-item-label">
                <FaFileAlt className="settings-item-icon" style={{ color: '#f59e0b' }} />
                Clear Drafts
              </div>
              <p className="settings-item-desc">
                Remove all draft try-on results.
              </p>
            </div>
            <button
              className="settings-action-btn settings-action-btn--danger"
              onClick={() => setShowClearDraftConfirm(true)}
              disabled={drafts.length === 0}
            >
              <FaTrashAlt /> Clear
            </button>
          </div>

          <div className="settings-item settings-item--action">
            <div className="settings-item-info">
              <div className="settings-item-label">
                <FaTrashAlt className="settings-item-icon" style={{ color: '#ef4444' }} />
                Clear All Data
              </div>
              <p className="settings-item-desc">
                Remove all favorites and drafts at once.
              </p>
            </div>
            <button
              className="settings-action-btn settings-action-btn--danger-full"
              onClick={() => setShowClearAllConfirm(true)}
              disabled={favorites.length === 0 && drafts.length === 0}
            >
              <FaTrashAlt /> Clear All
            </button>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="settings-section-title">
            <span className="settings-section-icon">ℹ️</span>
            About
          </h2>

          <div className="about-card">
            <div className="about-logo">
              <FaFlask className="about-logo-icon" />
              <span className="about-app-name">DripMatch</span>
            </div>
            <p className="about-desc">
              AI-powered virtual try-on. See how clothes look on you before you buy.
            </p>
            <div className="about-meta">
              <div className="about-meta-item">
                <FaInfoCircle />
                <span>Version 1.0.0</span>
              </div>
              <div className="about-meta-item">
                <FaGithub />
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ─── Confirmation Modals ─────────────────────────── */}
      <AnimatePresence>
        {showClearFavConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearFavConfirm(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="modal-title">Clear Favorites?</h3>
              <p className="modal-desc">
                This will permanently remove {favorites.length} favorite {favorites.length === 1 ? 'look' : 'looks'}. This cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="modal-btn modal-btn--cancel" onClick={() => setShowClearFavConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="modal-btn modal-btn--danger"
                  onClick={() => { clearFavorites(); setShowClearFavConfirm(false); }}
                >
                  <FaTrashAlt /> Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearDraftConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearDraftConfirm(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="modal-title">Clear Drafts?</h3>
              <p className="modal-desc">
                This will permanently remove {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}. This cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="modal-btn modal-btn--cancel" onClick={() => setShowClearDraftConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="modal-btn modal-btn--danger"
                  onClick={() => { clearDrafts(); setShowClearDraftConfirm(false); }}
                >
                  <FaTrashAlt /> Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearAllConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClearAllConfirm(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="modal-title">Clear All Data?</h3>
              <p className="modal-desc">
                This will permanently remove all {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'} and {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}. This cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="modal-btn modal-btn--cancel" onClick={() => setShowClearAllConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="modal-btn modal-btn--danger"
                  onClick={handleClearAll}
                >
                  <FaTrashAlt /> Clear Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Setting;
