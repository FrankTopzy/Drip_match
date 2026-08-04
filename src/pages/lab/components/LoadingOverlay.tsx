import { motion } from 'framer-motion';

const statusMessages = [
  'Analyzing your photo…',
  'Mapping garment onto your body…',
  'Applying realistic textures…',
  'Almost there — fine-tuning the fit…',
];

interface LoadingOverlayProps {
  statusMessage?: string;
}

export default function LoadingOverlay({ statusMessage }: LoadingOverlayProps) {
  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-content">
        {/* Animated rings */}
        <div className="loading-rings">
          <motion.div
            className="loading-ring loading-ring--outer"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="loading-ring loading-ring--inner"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="loading-ring-dot"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Status message */}
        <motion.p
          className="loading-status"
          key={statusMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {statusMessage || statusMessages[0]}
        </motion.p>

        {/* Progress dots */}
        <div className="loading-dots">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="loading-dot"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
