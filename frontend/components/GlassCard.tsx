'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  hoverEffect = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'glass-panel rounded-2xl p-6 relative overflow-hidden',
        hoverEffect && 'glass-panel-hover',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Subtle top border glow highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      {children}
    </motion.div>
  );
}
