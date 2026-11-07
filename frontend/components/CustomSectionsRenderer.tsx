'use client';

import React from 'react';
import GlassCard from './GlassCard';
import { Sparkles, Layers, Compass, CheckCircle2 } from 'lucide-react';
import { CustomSection } from '@/lib/types';

interface CustomSectionsRendererProps {
  sections: CustomSection[];
}

export default function CustomSectionsRenderer({
  sections,
}: CustomSectionsRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        const contentItems = Array.isArray(section.content)
          ? section.content
          : [];

        return (
          <section
            key={section.id}
            id={section.slug}
            className="py-20 relative border-t border-slate-800/40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  {section.section_type.toUpperCase()}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  <span className="text-gradient">{section.title}</span>
                </h2>
                {section.description && (
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Dynamic Items Render */}
              {contentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contentItems.map((item: any, idx: number) => (
                    <GlassCard key={idx} className="p-6 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {item.badge || 'Milestone'}
                          </span>
                          {item.status && (
                            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {item.status}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-slate-100">
                          {item.title || 'Initiative'}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 glass-panel rounded-2xl max-w-lg mx-auto">
                  <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">
                    Content for this section will be dynamically populated from the Admin CMS.
                  </p>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
