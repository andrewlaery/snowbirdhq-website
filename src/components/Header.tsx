'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuToggle from './MenuToggle';
import MenuOverlay from './MenuOverlay';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isDark = scrolled && !menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-300 md:px-10 ${
          isDark
            ? 'bg-white/90 backdrop-blur-md'
            : menuOpen
              ? 'bg-transparent'
              : 'bg-transparent'
        }`}
      >
        <Link
          href="/"
          className={`font-serif text-lg tracking-wider-xl transition-colors duration-300 ${
            isDark ? 'text-black' : 'text-white'
          }`}
        >
          SNOWBIRD
        </Link>
        <MenuToggle
          isOpen={menuOpen}
          toggle={() => setMenuOpen((prev) => !prev)}
          dark={isDark}
        />
      </header>
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
