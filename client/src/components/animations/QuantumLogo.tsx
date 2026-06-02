import { motion } from "framer-motion";

interface QuantumLogoProps {
  size?: number;
  className?: string;
}

const nucleusColors = ["#6366f1", "#e040fb", "#d4a017", "#cc2200", "#1e1b4b", "#6366f1"];
const nucleusAlt = ["#a78bfa", "#f0abfc", "#fbbf24", "#f87171", "#2e1065", "#a78bfa"];

const QuantumLogo = ({ size = 200, className = "" }: QuantumLogoProps) => {
  return (
    <div style={{ width: size, height: size }} className={className}>
      <svg width={size} height={size} viewBox="-100 -100 200 200">
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

        {/* Ring 1 — indigo, forward 3s */}
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          animate={{ rotate: 360, opacity: [0.7, 1, 0.7] }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="28" fill="none" strokeWidth="2"
            filter="url(#ring-glow)"
            style={{ animation: "stroke-indigo 2s ease-in-out infinite" }}
          />
          <circle cx="85" cy="0" r="6" fill="#a5b4fc" filter="url(#electron-glow)" />
          <circle cx="-85" cy="0" r="4" fill="#a5b4fc" filter="url(#electron-glow)" opacity="0.6" />
        </motion.g>

        {/* Ring 2 — blue, reverse 4s, offset 30° */}
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={{ rotate: 30 }}
          animate={{ rotate: -330, opacity: [1, 0.6, 1] }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="28" fill="none" strokeWidth="2"
            filter="url(#ring-glow)"
            style={{ animation: "stroke-blue 2.5s ease-in-out infinite" }}
          />
          <circle cx="85" cy="0" r="6" fill="#93c5fd" filter="url(#electron-glow)" />
          <circle cx="-85" cy="0" r="4" fill="#93c5fd" filter="url(#electron-glow)" opacity="0.6" />
        </motion.g>

        {/* Ring 3 — purple, forward 6s, offset 60° */}
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={{ rotate: 60 }}
          animate={{ rotate: 420, opacity: [0.8, 1, 0.8] }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="28" fill="none" strokeWidth="2"
            filter="url(#ring-glow)"
            style={{ animation: "stroke-purple 3s ease-in-out infinite" }}
          />
          <circle cx="85" cy="0" r="6" fill="#c4b5fd" filter="url(#electron-glow)" />
          <circle cx="-85" cy="0" r="4" fill="#c4b5fd" filter="url(#electron-glow)" opacity="0.6" />
        </motion.g>

        {/* Ring 4 — gold, reverse 3.5s, offset 90° */}
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={{ rotate: 90 }}
          animate={{ rotate: -270, opacity: [0.6, 1, 0.6] }}
          transition={{
            rotate: { duration: 3.5, repeat: Infinity, ease: "linear" },
            opacity: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="28" fill="none" strokeWidth="2.5"
            filter="url(#ring-glow)"
            style={{ animation: "stroke-gold 2s ease-in-out infinite" }}
          />
          <circle cx="85" cy="0" r="6" fill="#fbbf24" filter="url(#electron-glow)" />
          <circle cx="-85" cy="0" r="4" fill="#fbbf24" filter="url(#electron-glow)" opacity="0.6" />
        </motion.g>

        {/* Ring 5 — crimson, forward 5s, offset 120° */}
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={{ rotate: 120 }}
          animate={{ rotate: 480, opacity: [1, 0.7, 1] }}
          transition={{
            rotate: { duration: 5, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="28" fill="none" strokeWidth="2.5"
            filter="url(#ring-glow)"
            style={{ animation: "stroke-crimson 1.8s ease-in-out infinite" }}
          />
          <circle cx="85" cy="0" r="6" fill="#f87171" filter="url(#electron-glow)" />
          <circle cx="-85" cy="0" r="4" fill="#f87171" filter="url(#electron-glow)" opacity="0.6" />
        </motion.g>

        {/* Ring 6 — magenta, reverse 5.5s, offset 150° */}
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={{ rotate: 150 }}
          animate={{ rotate: -210, opacity: [0.7, 1, 0.7] }}
          transition={{
            rotate: { duration: 5.5, repeat: Infinity, ease: "linear" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ellipse cx="0" cy="0" rx="85" ry="28" fill="none" strokeWidth="2"
            filter="url(#ring-glow)"
            style={{ animation: "stroke-magenta 2.2s ease-in-out infinite" }}
          />
          <circle cx="85" cy="0" r="6" fill="#f0abfc" filter="url(#electron-glow)" />
          <circle cx="-85" cy="0" r="4" fill="#f0abfc" filter="url(#electron-glow)" opacity="0.6" />
        </motion.g>

        {/* Nucleus — all circles color cycling, organic pulse */}
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          animate={{ scale: [1, 1.2, 0.92, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.circle cx="0" cy="0" r="22"
            animate={{ fill: nucleusColors }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            filter="url(#nucleus-glow)"
          />
          <motion.circle cx="-7" cy="-6" r="11"
            animate={{ fill: nucleusAlt }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.circle cx="8" cy="-5" r="10"
            animate={{ fill: nucleusColors }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.circle cx="0" cy="9" r="10"
            animate={{ fill: nucleusAlt }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          />
          <motion.circle cx="-2" cy="0" r="6"
            animate={{ fill: nucleusColors }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
        </motion.g>
      </svg>
    </div>
  );
};

export default QuantumLogo;