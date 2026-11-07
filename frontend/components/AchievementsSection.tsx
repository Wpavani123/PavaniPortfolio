'use client';

import React from 'react';
import GlassCard from './GlassCard';
import { Trophy, Calendar, ExternalLink, Sparkles } from 'lucide-react';
import { Achievement } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export default function AchievementsSection({
  achievements,
}: AchievementsSectionProps) {
  return (
    <section id="achievements" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-amber-400 glass-panel uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            Extracurricular &amp; Honors
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Key <span className="text-gradient">Achievements &amp; Activities</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Hackathons, AI summits, cloud community engagements, and national youth leadership camps.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <GlassCard key={ach.id} className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  {ach.date && (
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(ach.date)}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-100 mb-1 leading-snug">
                    {ach.title}
                  </h3>
                  {ach.organization && (
                    <p className="text-xs font-mono text-cyan-400 mb-2">
                      {ach.organization}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {ach.link && (
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <a
                    href={ach.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    View Details / Credential
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
