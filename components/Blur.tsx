'use client';

export function Blur() {
  return (
    <>
      {/* Top Blur */}
      <div
        className="pointer-events-none fixed -top-24 left-0 h-48 w-full backdrop-blur-md sm:h-48 z-40"
        style={{ 
          mask: 'linear-gradient(black 50%, transparent)', 
          opacity: 1,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />
      {/* Bottom Blur */}
      <div
        className="pointer-events-none fixed -bottom-32 left-0 h-52 w-full backdrop-blur-md sm:h-60 z-40"
        style={{ 
          mask: 'linear-gradient(transparent, black 50%)', 
          opacity: 1,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />
      {/* Left Blur */}
      {/* <div
        className="pointer-events-none fixed top-0 -left-24 h-full w-48 backdrop-blur-md sm:w-48 z-30"
        style={{ 
          mask: 'linear-gradient(to right, black 50%, transparent)', 
          opacity: 1,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      /> */}
      {/* Right Blur */}
      <div
        className="pointer-events-none fixed top-0 -right-24 h-full w-48 backdrop-blur-md sm:w-48 z-30"
        style={{ 
          mask: 'linear-gradient(to left, black 50%, transparent)', 
          opacity: 1,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />
    </>
  );
}
