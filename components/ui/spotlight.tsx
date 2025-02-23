'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  children: React.ReactNode;
}

export const Spotlight = ({ className, children }: SpotlightProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    divRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      divRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMounted]);

  return (
    <div
      ref={divRef}
      className={cn(
        'relative overflow-hidden rounded-xl border border-orange-500/20',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-transform"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,140,50,.15), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};