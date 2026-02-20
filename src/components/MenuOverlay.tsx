'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PropertyGrid from './PropertyGrid';
import { getFeaturedProperties } from '@/data/properties';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '/#properties', label: 'Properties' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 overflow-y-auto bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex min-h-screen flex-col px-8 pt-24 pb-12 md:flex-row md:items-start md:gap-16 md:px-16 md:pt-32">
            {/* Nav links */}
            <nav className="mb-12 flex flex-col gap-6 md:mb-0 md:w-1/3">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="font-serif text-4xl text-black transition-colors hover:text-muted md:text-5xl"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Property grid */}
            <motion.div
              className="md:w-2/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <p className="mb-6 text-xs uppercase tracking-wider-xl text-muted">
                Our Properties
              </p>
              <PropertyGrid properties={getFeaturedProperties()} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
