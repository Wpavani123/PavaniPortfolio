'use client';

import React, { useState } from 'react';
import GlassCard from './GlassCard';
import {
  Cloud,
  Terminal,
  Code,
  BarChart2,
  Cpu,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Skill } from '@/lib/types';

interface SkillsSectionProps {
  skills: Skill[];
}

const categoryIcons: Record<string, any> = {
  Cloud: Cloud,
  DevOps: Terminal,
  Programming: Code,
  'Data / BI': BarChart2,
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Cloud', 'DevOps', 'Programming', 'Data / BI'];

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'advanced':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'intermediate':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Technical Arsenal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Core <span className="text-gradient">Skills & Technologies</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Dynamic, database-driven technical skills in Cloud Infrastructure, DevOps pipelines, and Automation.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Layers;
            const count =
              cat === 'All'
                ? skills.length
                : skills.filter((s) => s.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'glass-panel text-slate-400 hover:text-slate-200 hover:border-cyan-500/40'
                }`}
              >
                {cat !== 'All' && <Icon className="w-3.5 h-3.5" />}
                <span>{cat}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/60 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredSkills.map((skill) => (
            <GlassCard key={skill.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {skill.name}
                        {skill.is_featured && (
                          <Sparkles
                            className="w-3 h-3 text-amber-400"
                            aria-label="Featured Skill"
                          />
                        )}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getLevelBadgeColor(
                      skill.level
                    )}`}
                  >
                    {skill.level}
                  </span>
                </div>

                {skill.description && (
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Experience:</span>
                <span className="text-slate-300 font-medium">{skill.years_experience} yrs</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
