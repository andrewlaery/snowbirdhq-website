'use client';

import { motion } from 'framer-motion';

interface MenuToggleProps {
  isOpen: boolean;
  toggle: () => void;
  dark?: boolean;
}

const line = {
  closed: { rotate: 0, y: 0 },
  open: (i: number) =>
    i === 0
      ? { rotate: 45, y: 7 }
      : i === 1
        ? { opacity: 0 }
        : { rotate: -45, y: -7 },
};

export default function MenuToggle({ isOpen, toggle, dark = false }: MenuToggleProps) {
  const stroke = dark ? '#000' : '#fff';

  return (
    <button
      onClick={toggle}
      className="relative z-50 flex h-10 w-10 items-center justify-center"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <svg width="24" height="18" viewBox="0 0 24 18">
        {[0, 1, 2].map((i) => (
          <motion.line
            key={i}
            x1="0"
            x2="24"
            y1={2 + i * 7}
            y2={2 + i * 7}
            stroke={isOpen ? '#000' : stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={isOpen ? 'open' : 'closed'}
            variants={{
              closed: { rotate: 0, y: 0, opacity: 1 },
              open: line.open(i),
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ originX: '12px', originY: `${2 + i * 7}px` }}
          />
        ))}
      </svg>
    </button>
  );
}
