'use client';

import { cn } from "@/lib/utils";

interface RetroCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export default function RetroCard({ title, description, icon, className }: RetroCardProps) {
  return (
    <div className={cn(
      'relative p-6 bg-slate-800 text-cream-100',
      'before:absolute before:inset-0 before:border-4 before:border-orange-600 before:-translate-x-2 before:-translate-y-2',
      'transition-all hover:before:-translate-x-4 hover:before:-translate-y-4',
      className
    )}>
      <div className="mb-4 text-orange-500">{icon}</div>
      <h3 className="text-xl font-mono font-bold mb-2 text-orange-400">{title}</h3>
      <p className="font-mono text-cream-200">{description}</p>
    </div>
  );
}