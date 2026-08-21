import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import type { Garment, GarmentCategoryFilter } from '../../../data/garments';
import { garments } from '../../../data/garments';

interface GarmentGridProps {
  selectedGarment: Garment | null;
  onSelect: (garment: Garment) => void;
}

type Category = {
  key: GarmentCategoryFilter;
  label: string;
}

const categories: Category[] = [
  { key: 'all', label: 'All' },
  { key: 'upper_body', label: 'Tops' },
  { key: 'lower_body', label: 'Pants' },
  { key: 'full_body', label: 'Full Outfits' },
];

const CUSTOM_GARMENT_ID = 'custom-upload';


export default function GarmentGrid({selectedGarment, onSelect}: GarmentGridProps) {
  const [activeCategory, setActiveCategory] = useState<GarmentCategoryFilter>('all');
  const [customGarment, setCustomGarment] = useState<Garment | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = activeCategory === 'all' ? garments : garments.filter((g) => g.category === activeCategory);

  const handleCustomFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);

    const custom: Garment = {
      id: CUSTOM_GARMENT_ID,
      name: file.name.replace(/\.[^.]+$/, '') || 'My Garment',
      category: 'upper_body',
      imageUrl: url,
      description: 'Custom uploaded garment',
      price: '—',
      localFile: file, // carry the File so the API layer can upload it
    };

    setCustomGarment(custom);
    onSelect(custom);
  }, [onSelect]);


  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target);
    
    const file = e.target.files?.[0];

    if (file) handleCustomFile(file);

    e.target.value = '';
  }, [handleCustomFile]);


  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log(e);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleCustomFile(file);
  }, [handleCustomFile]);


  const handleRemoveCustom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (customGarment) URL.revokeObjectURL(customGarment.imageUrl);
    
    setCustomGarment(null);
    if (selectedGarment?.id === CUSTOM_GARMENT_ID) {
      // deselect — parent expects a Garment; pass first catalogued garment as fallback
      onSelect(garments[0]);
    }
  }, [customGarment, selectedGarment]);

  return (
    <div className="garment-panel">
      <h3 className="section-label">Select Garment</h3>

      {/* Category tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button key={cat.key}
            className={`category-tab ${activeCategory === cat.key ? 'category-tab--active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Garment grid */}
      <div className="garment-grid">
        {/* Upload your own tile */}
        <AnimatePresence mode="wait">
          {customGarment ? (
            <motion.button
              key="custom-filled"
              className={`garment-card ${selectedGarment?.id === CUSTOM_GARMENT_ID ? 'garment-card--selected' : ''}`}
              onClick={() => onSelect(customGarment)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="garment-card-img-wrap">
                <img src={customGarment.imageUrl} alt={customGarment.name} />
              </div>
              <div className="garment-card-info">
                <p className="garment-card-name">{customGarment.name}</p>
                <p className="garment-card-price">Custom Upload</p>
              </div>
              {selectedGarment?.id === CUSTOM_GARMENT_ID && (
                <motion.div
                  className="garment-selected-badge"
                  layoutId="garment-badge"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  ✓
                </motion.div>
              )}
              <p
                className="garment-custom-remove"
                onClick={handleRemoveCustom}
                title="Remove"
              >
                <FaTimes />
              </p>
            </motion.button>
          ) : (
            <motion.div
              key="custom-upload"
              className={`garment-upload-tile ${isDragOver ? 'garment-upload-tile--dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { 
                                  e.preventDefault(); 
                                  setIsDragOver(true);
                                 }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaCloudUploadAlt className="garment-upload-icon" />
              <p className="garment-upload-text">Upload<br />Your Own</p>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={handleFileInput}
        />

        {filtered.map((garment, i) => (
          <motion.button
            key={garment.id}
            className={`garment-card ${selectedGarment?.id === garment.id ? 'garment-card--selected' : ''}`}
            onClick={() => onSelect(garment)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="garment-card-img-wrap">
              <img src={garment.imageUrl} alt={garment.name} />
            </div>
            <div className="garment-card-info">
              <p className="garment-card-name">{garment.name}</p>
              <p className="garment-card-price">{garment.price}</p>
            </div>
            {selectedGarment?.id === garment.id && (
              <motion.div
                className="garment-selected-badge"
                layoutId="garment-badge"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
