'use client';

import React from 'react';
import GlassCard from './GlassCard';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { Education } from '@/lib/types';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            Academic Background
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Education &amp; <span className="text-gradient">Qualifications</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Formal engineering degree and pre-university sciences foundation.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((edu) => (
            <GlassCard key={edu.id} className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.start_year} – {edu.end_year}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-100 mb-1 leading-snug">
                    {edu.degree}
                  </h3>
                  <p className="text-xs font-semibold text-slate-300">
                    {edu.institution}
                  </p>
                  {edu.location && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {edu.location}
                    </p>
                  )}
                </div>

                {edu.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>

              {edu.grade && (
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Graduation Standing:</span>
                  <span className="text-emerald-400 font-semibold">{edu.grade}</span>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
