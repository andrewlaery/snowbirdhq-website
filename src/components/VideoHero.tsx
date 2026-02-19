'use client';

import { motion } from 'framer-motion';

interface VideoHeroProps {
  videoSrc?: string;
  imageSrc?: string;
  heading?: string;
  subtext?: string;
}

export default function VideoHero({
  videoSrc,
  imageSrc,
  heading,
  subtext,
}: VideoHeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {videoSrc ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={imageSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : imageSrc ? (
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-neutral-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {(heading || subtext) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          {heading && (
            <h1 className="font-serif text-4xl font-light tracking-wide md:text-6xl lg:text-7xl">
              {heading}
            </h1>
          )}
          {subtext && (
            <p className="mt-4 max-w-xl text-sm font-light tracking-wider text-white/80 md:text-base">
              {subtext}
            </p>
          )}
        </div>
      )}

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
}
