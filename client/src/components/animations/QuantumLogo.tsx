import { motion } from 'framer-motion';

interface QuantumLogoProps {
  size?: number;
  className?: string;
}

// Nucleus fill keyframes — cycles through the full quantum color spectrum
const nucleusColors = ['#6366f1', '#e040fb', '#d4a017', '#cc2200', '#1e1b4b', '#6366f1'];

// Alternating spectrum for staggered nucleus circles
const nucleusAlt = ['#a78bfa', '#f0abfc', '#fbbf24', '#f87171', '#2e1065', '#a78bfa'];

// Parametric ellipse path — x = rx·cos(θ), y = ry·sin(θ) at 45° intervals — electron traces the full orbital path
const orbitPath = {
  cx: [85, 60, 0, -60, -85, -60, 0, 60, 85],
  cy: [0, 18, 25, 18, 0, -18, -25, -18, 0],
};
const orbitTimes = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

// QuantumLogo — animated SVG atom with multi-axis orbital rings, electrons, and color-cycling nucleus
// size prop controls display dimensions — use large values on auth pages, small on navbar
const QuantumLogo = ({ size = 120, className = '' }: QuantumLogoProps) => {
  return (
    <div
      style={{ width: size, height: size, perspective: 600 }}
      className={className}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="-100 -100 200 200"
        animate={{ scale: [1, 1.07, 0.97, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nucleus-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="electron-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ring 1 — indigo, rotateZ forward, 5s */}
        <motion.g
          style={{ transformOrigin: '0px 0px' }}
          animate={{ rotate: 360, opacity: [0.7, 1, 0.7] }}
          transition={{
            rotate: { duration: 5, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="25" fill="none" stroke="#6366f1" strokeWidth="2" filter="url(#ring-glow)" />
          <motion.circle
            r="5" fill="#a5b4fc" filter="url(#electron-glow)"
            animate={orbitPath}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', times: orbitTimes }}
          />
        </motion.g>

        {/* Ring 2 — electric blue, rotateX (front-to-back), 7s */}
        <motion.g
          style={{ transformOrigin: '0px 0px' }}
          animate={{ rotateX: 360, opacity: [1, 0.6, 1] }}
          transition={{
            rotateX: { duration: 7, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="25" fill="none" stroke="#60a5fa" strokeWidth="2" filter="url(#ring-glow)" />
          <circle cx="85" cy="0" r="5" fill="#93c5fd" filter="url(#electron-glow)" />
        </motion.g>

        {/* Ring 3 — purple, rotateZ forward, offset 120°, 10s */}
        <motion.g
          style={{ transformOrigin: '0px 0px' }}
          initial={{ rotate: 120 }}
          animate={{ rotate: 480, opacity: [0.8, 1, 0.8] }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="25" fill="none" stroke="#8b5cf6" strokeWidth="2" filter="url(#ring-glow)" />
          <motion.circle
            r="5" fill="#c4b5fd" filter="url(#electron-glow)"
            animate={orbitPath}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear', times: orbitTimes }}
          />
        </motion.g>

        {/* Ring 4 — gold, rotateY (side-to-side), 6s */}
        <motion.g
          style={{ transformOrigin: '0px 0px' }}
          animate={{ rotateY: 360, opacity: [0.6, 1, 0.6] }}
          transition={{
            rotateY: { duration: 6, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="25" fill="none" stroke="#d4a017" strokeWidth="2.5" filter="url(#ring-glow)" />
          <circle cx="85" cy="0" r="5" fill="#fbbf24" filter="url(#electron-glow)" />
        </motion.g>

        {/* Ring 5 — crimson, rotateZ reverse, offset 90°, 8s */}
        <motion.g
          style={{ transformOrigin: '0px 0px' }}
          initial={{ rotate: 90 }}
          animate={{ rotate: -270, opacity: [1, 0.7, 1] }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="25" fill="none" stroke="#cc2200" strokeWidth="2.5" filter="url(#ring-glow)" />
          <motion.circle
            r="5" fill="#f87171" filter="url(#electron-glow)"
            animate={orbitPath}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear', times: orbitTimes }}
          />
        </motion.g>

        {/* Ring 6 — magenta, rotateX reverse, 9s */}
        <motion.g
          style={{ transformOrigin: '0px 0px' }}
          animate={{ rotateX: -360, opacity: [0.7, 1, 0.7] }}
          transition={{
            rotateX: { duration: 9, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="25" fill="none" stroke="#e040fb" strokeWidth="2" filter="url(#ring-glow)" />
          <circle cx="-85" cy="0" r="5" fill="#f0abfc" filter="url(#electron-glow)" />
        </motion.g>

        {/* Nucleus — all circles color cycling, organic pulse */}
        <motion.g
          style={{ transformOrigin: '0px 0px' }}
          animate={{ scale: [1, 1.2, 0.92, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.circle
            cx="0" cy="0" r="22"
            animate={{ fill: nucleusColors }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            filter="url(#nucleus-glow)"
          />
          <motion.circle
            cx="-7" cy="-6" r="11"
            animate={{ fill: nucleusAlt }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.circle
            cx="8" cy="-5" r="10"
            animate={{ fill: nucleusColors }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          <motion.circle
            cx="0" cy="9" r="10"
            animate={{ fill: nucleusAlt }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
          />
          <motion.circle
            cx="-2" cy="0" r="6"
            animate={{ fill: nucleusColors }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default QuantumLogo;