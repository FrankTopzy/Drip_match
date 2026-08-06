import { useState } from 'react';
import { motion } from 'framer-motion';
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
  { key: 'lower_body', label: 'Bottoms' },
  { key: 'full_body', label: 'Full Outfits' },
];

export default function GarmentGrid({selectedGarment, onSelect}: GarmentGridProps) {
  const [activeCategory, setActiveCategory] = useState<GarmentCategoryFilter>('all');

  const filtered = activeCategory === 'all' ? garments : garments.filter((g) => g.category === activeCategory);

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
