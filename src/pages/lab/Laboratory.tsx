import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaFlask, FaTshirt, FaCamera, FaMagic, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import GarmentGrid from './components/GarmentGrid';
import PhotoUploader from './components/PhotoUploader';
import ResultViewer from './components/ResultViewer';
import LoadingOverlay from './components/LoadingOverlay';
import { tryOnWithUrls, uploadFile, startTryOnTaskWithUploadedUser, startTryOnTaskWithBothFileIds, pollTaskResult } from '../../services/youCamService';
import type { Garment } from '../../data/garments';
import type { TryOnResult } from '../../services/youCamService';
import './laboratory.css';
import type { IconType } from 'react-icons';

type LabStep = 'select' | 'processing' | 'result';

type Steps = {
 label: string;
 icon: IconType;
};

function Laboratory() {
  // State
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [referencePhotoUrl, setReferencePhotoUrl] = useState<string | null>(null);
  const [result, setResult] = useState<TryOnResult | null>(null); 
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [step, setStep] = useState<LabStep>('select');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  

  const steps: Steps[] = [
                  { label: 'Choose Garment', icon: FaTshirt },
                  { label: 'Upload Photo', icon: FaCamera },
                  { label: 'See Result', icon: FaMagic },
                ];

  const activeStep = step === 'result' ? 3 : referencePhotoUrl ? 2 : selectedGarment ? 1 : 0;

  // Photo selection handler
  const handlePhotoSelect = useCallback((url: string, file?: File) => {
    setReferencePhotoUrl(url);
    setReferenceFile(file ?? null);
    setError(null);
  }, []);

  const handlePhotoClear = useCallback(() => {
    setReferencePhotoUrl(null);
    setReferenceFile(null);
  }, []); 

  const handleGarmentSelect = useCallback((garment: Garment) => {
    setSelectedGarment(garment);
    
    setError(null);
  }, []);

  // Try-On execution
  const handleTryOn = useCallback(async () => {
    if (!selectedGarment || !referencePhotoUrl) return;

    setStep('processing');
    setError(null);
    setStatusMessage('Starting virtual try-on...');

    try {
      let tryOnResult: TryOnResult;

      const isCustomGarment = !!selectedGarment.localFile;

      if (referenceFile && isCustomGarment) {
        // Both the person photo AND the garment are local files.
        // Upload both to YouCam so their servers can access them.
        setStatusMessage('Uploading your photo...');
        const userFileId = await uploadFile(referenceFile);

        setStatusMessage('Uploading garment...');
        const garmentFileId = await uploadFile(selectedGarment.localFile!);

        setStatusMessage('Starting try-on task...');
        const taskId = await startTryOnTaskWithBothFileIds(
          garmentFileId,
          userFileId,
          selectedGarment.category,
        );

        setStatusMessage('Processing your look...');
        tryOnResult = await pollTaskResult(taskId);

      } else if (referenceFile) {
        // Person photo is a local file; garment is a public URL.
        setStatusMessage('Uploading your photo...');
        const userFileId = await uploadFile(referenceFile);

        setStatusMessage('Starting try-on task...');
        const taskId = await startTryOnTaskWithUploadedUser(
          userFileId,
          selectedGarment.imageUrl,
          selectedGarment.category,
        );

        setStatusMessage('Processing your look...');
        tryOnResult = await pollTaskResult(taskId);

      } else {
        // Both garment and reference photo are public URLs — direct URL flow.
        tryOnResult = await tryOnWithUrls(
          selectedGarment.imageUrl,
          referencePhotoUrl,
          selectedGarment.category,
          setStatusMessage,
        );
      }

      setResult(tryOnResult);
      setStep('result');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setStep('select');
    }
  }, [selectedGarment, referencePhotoUrl, referenceFile]);



  // Reset to try another
  const handleTryAnother = useCallback(() => {
    setResult(null);
    setStep('select');
    setError(null);
  }, []);

  // Determine active step for indicator

  const canTryOn = selectedGarment && referencePhotoUrl && step === 'select';

  return (
    <div className="lab-page">
      {/* Header */}
      <div className="lab-header">
        <motion.h1
          className="lab-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaFlask style={{ display: 'inline', marginRight: '0.5rem', fontSize: '2rem' }} />
          The Laboratory
        </motion.h1>
        <motion.p
          className="lab-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          See how clothes look on you before you buy. Select a garment, upload your photo, and let AI do the rest.
        </motion.p>
      </div>

      {/* Step indicator */}
      <div className="steps-indicator">
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className={`step-dot ${activeStep >= i + 1 ? (activeStep > i + 1 ? 'step-dot--done' : 'step-dot--active') : ''}`}>
              <div className="step-number">
                {activeStep > i + 1 ? <FaCheckCircle /> : i + 1}
              </div>
              
              <span>{s.label}</span>
            </div>

            {i < 2 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-banner"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            style={{ maxWidth: 'var(--max-w)', width: '100%' }}
          >
            <FaExclamationTriangle className="error-banner-icon" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lab-content">
        {/* Left panel — Garment selection */}
        <div className="glass-panel">
          <GarmentGrid selectedGarment={selectedGarment} onSelect={handleGarmentSelect}/>
        </div>

        {/* Center panel — Stage */}
        <div className="glass-panel stage-panel">
          <AnimatePresence mode="wait">
            {step === 'result' && result?.resultImageUrl && referencePhotoUrl ? (
              <ResultViewer
                key="result"
                originalPhotoUrl={referencePhotoUrl}
                resultImageUrl={result.resultImageUrl}
                garmentName={selectedGarment?.name ?? 'garment'}
                garmentCategory={selectedGarment?.category ?? ''}
                garmentPrice={selectedGarment?.price ?? ''}
                garmentImageUrl={selectedGarment?.imageUrl ?? ''}
                onTryAnother={handleTryAnother}
              />
            ) : (
              <motion.div
                key="upload-stage"
                className="stage-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {!referencePhotoUrl && !selectedGarment ? (
                  <div className="stage-empty-state">
                    <div className="stage-empty-icon">👗</div>
                    <p className="stage-empty-text">
                      Start by selecting a garment from the left panel,<br />
                      then upload your photo to try it on.
                    </p>
                  </div>
                ) : (
                  <PhotoUploader
                    onPhotoSelect={handlePhotoSelect}
                    selectedPhotoUrl={referencePhotoUrl}
                    onClear={handlePhotoClear}
                  />
                )}

                {/* Try It On button */}
                <div className="tryon-btn-container">
                  <motion.button
                    className="tryon-btn"
                    disabled={!canTryOn}
                    onClick={handleTryOn}
                    whileHover={canTryOn ? { scale: 1.03 } : {}}
                    whileTap={canTryOn ? { scale: 0.97 } : {}}
                  >
                    <FaMagic /> Try It On
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading overlay */}
          <AnimatePresence>
            {step === 'processing' && (
              <LoadingOverlay statusMessage={statusMessage} />
            )}
          </AnimatePresence>
        </div>

        {/* Right panel — Details */}
        <div className="glass-panel details-panel">
          <h3 className="section-label">Details</h3>

          <AnimatePresence mode="wait">
            {selectedGarment ? (
              <motion.div
                key={selectedGarment.id}
                className="garment-detail-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={selectedGarment.imageUrl}
                  alt={selectedGarment.name}
                  className="garment-detail-img"
                />
                <div>
                  <p className="garment-detail-name">{selectedGarment.name}</p>
                  <p className="garment-detail-desc">{selectedGarment.description}</p>
                  <p className="garment-detail-price">{selectedGarment.price}</p>
                </div>

                <div className="garment-detail-meta">
                  <span className="garment-detail-tag">
                    <FaTshirt /> {selectedGarment.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="confidence-tips">
                  <h4 className="section-label" style={{ marginBottom: '0.75rem' }}>Tips for best results</h4>
                  <div className="confidence-tip">
                    <FaInfoCircle className="confidence-tip-icon" />
                    <span>Use a well-lit, front-facing photo for the most accurate try-on.</span>
                  </div>
                  <div className="confidence-tip">
                    <FaInfoCircle className="confidence-tip-icon" />
                    <span>Simple backgrounds work best — avoid cluttered scenes.</span>
                  </div>
                  <div className="confidence-tip">
                    <FaInfoCircle className="confidence-tip-icon" />
                    <span>Full-body or half-body shots produce more natural results.</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="details-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
              >
                <div className="details-empty-icon">✨</div>
                <p className="details-empty-text">
                  Select a garment to see details here
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Laboratory;