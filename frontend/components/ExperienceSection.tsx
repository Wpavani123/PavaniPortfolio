'use client';

import React from 'react';
import GlassCard from './GlassCard';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Experience } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            Career Foundations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Professional <span className="text-gradient">Training &amp; Simulations</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Structured cloud engineering graduate cohorts and enterprise simulation programs.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-slate-800 before:-translate-x-1/2">
          {experience.map((exp, idx) => (
            <div
              key={exp.id}
              className={`relative flex flex-col sm:flex-row items-start ${
                idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Node */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 z-10 shadow-lg shadow-cyan-500/30">
                <Briefcase className="w-3.5 h-3.5" />
              </div>

              {/* Card Container */}
              <div className="w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {exp.type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(exp.start_date)} – {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-100">{exp.role}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-semibold text-slate-200">{exp.company}</span>
                    {exp.location && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
