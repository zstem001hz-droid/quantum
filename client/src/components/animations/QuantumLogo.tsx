import { motion } from "framer-motion";

interface QuantumLogoProps {
  size?: number;
  className?: string;
}

const QuantumLogo = ({ size = 80, className = "" }: QuantumLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      className={className}
    >
      <defs>
        {/* Soft glow for orbital rings */}
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Stronger glow for nucleus */}
        <filter id="nucleus-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Orbital Ring 1 — indigo, slow forward rotation */}
      <motion.g
        style={{ transformOrigin: "0px 0px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <ellipse
          cx="0"
          cy="0"
          rx="85"
          ry="25"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.5"
          filter="url(#ring-glow)"
        />
      </motion.g>

      {/* Orbital Ring 2 — electric blue, reverse rotation, offset 60° */}
      <motion.g
        style={{ transformOrigin: "0px 0px" }}
        initial={{ rotate: 60 }}
        animate={{ rotate: -300 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <ellipse
          cx="0"
          cy="0"
          rx="85"
          ry="25"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.5"
          filter="url(#ring-glow)"
        />
      </motion.g>

      {/* Orbital Ring 3 — purple, slower forward, offset 120° */}
      <motion.g
        style={{ transformOrigin: "0px 0px" }}
        initial={{ rotate: 120 }}
        animate={{ rotate: 480 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <ellipse
          cx="0"
          cy="0"
          rx="85"
          ry="25"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          filter="url(#ring-glow)"
        />
      </motion.g>

      {/* Nucleus — pulsing cluster of spheres */}
      <motion.g
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        <circle
          cx="0"
          cy="0"
          r="22"
          fill="#3730a3"
          filter="url(#nucleus-glow)"
        />
        <circle cx="-7" cy="-6" r="11" fill="#4f46e5" />
        <circle cx="8" cy="-5" r="10" fill="#6366f1" />
        <circle cx="0" cy="9" r="10" fill="#7c3aed" />
        <circle cx="-2" cy="0" r="6" fill="#a78bfa" />
      </motion.g>
    </svg>
  );
};

export default QuantumLogo;
