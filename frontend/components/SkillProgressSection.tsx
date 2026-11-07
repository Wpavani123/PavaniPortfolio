'use client';

import React from 'react';
import GlassCard from './GlassCard';
import { Sparkles, Calendar, BookOpen, ExternalLink, TrendingUp, CheckCircle2 } from 'lucide-react';
import { SkillProgress, Skill } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface SkillProgressSectionProps {
  progressLogs: SkillProgress[];
  skills: Skill[];
}

export default function SkillProgressSection({
  progressLogs,
  skills,
}: SkillProgressSectionProps) {
  // Map skill id to name
  const skillMap = new Map<string, Skill>();
  skills.forEach((s) => skillMap.set(s.id, s));

  return (
    <section id="learning" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-400 glass-panel uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Live Growth Tracker
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Currently Learning &amp; <span className="text-gradient">Daily Progress</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Continuous engineering roadmap. Updated regularly via Admin Dashboard as new concepts, DSA problems, and cloud architectures are mastered.
          </p>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressLogs.length === 0 ? (
            <div className="col-span-2 text-center py-12 glass-panel rounded-2xl">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-bounce" />
              <p className="text-slate-400 text-sm">Learning logs are currently being updated.</p>
            </div>
          ) : (
            progressLogs.map((log) => {
              const skill = skillMap.get(log.skill_id);
              const skillName = skill ? skill.name : 'Technical Skill';
              const skillCategory = skill ? skill.category : 'Engineering';

              return (
                <GlassCard key={log.id} className="p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Top Row: Skill & Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-100">
                            {skillName}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                            {skillCategory}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Status: {log.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-bold font-mono text-cyan-400">
                          {log.progress_percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                      <div
                        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${log.progress_percentage}%` }}
                      />
                    </div>

                    {/* Learning Note */}
                    <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      &ldquo;{log.learning_note}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Metadata: Date & Resources */}
                  <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(log.progress_date)}
                    </span>
                    {log.resources && (
                      <span className="flex items-center gap-1 text-slate-400 truncate max-w-[200px]" title={log.resources}>
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        {log.resources}
                      </span>
                    )}
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
