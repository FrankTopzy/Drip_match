import { useState, useRef, useCallback } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploaderProps {
  onPhotoSelect: (url: string, file?: File) => void;
  selectedPhotoUrl: string | null;
  onClear: () => void;
}

export default function PhotoUploader({onPhotoSelect, selectedPhotoUrl, onClear}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
      if (!file.type.startsWith('image/')) return;

      const previewUrl = URL.createObjectURL(file);
      onPhotoSelect(previewUrl, file);
    },
    [onPhotoSelect],
  );
  
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    }, [handleFile],
  );

  return (
    <div className="photo-uploader">
      <h3 className="section-label">Your Photo</h3>

      <AnimatePresence mode="wait">
        {selectedPhotoUrl ? (
          <motion.div
            key="preview"
            className="photo-preview-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <img src={selectedPhotoUrl} alt="Your reference" className="photo-preview-img"/>
            
            <button className="photo-remove-btn" onClick={onClear} title="Remove photo">
              <FaTrash />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={`drop-zone ${isDragging ? 'drop-zone--active' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <FaCloudUploadAlt className="drop-zone-icon" />
              <p className="drop-zone-text">
                Drag & drop your photo here
              </p>
              <p className="drop-zone-subtext">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden-input"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
