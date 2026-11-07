'use client';

import React from 'react';
import GlassCard from './GlassCard';
import { Award, ExternalLink, Calendar, CheckCircle2, Cloud } from 'lucide-react';
import { Certification } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export default function CertificationsSection({
  certifications,
}: CertificationsSectionProps) {
  return (
    <section id="certifications" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-amber-400 glass-panel uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Verified Credentials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Industry <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Validated certifications in AWS cloud architecture, AI foundations, and modern software development.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <GlassCard
              key={cert.id}
              className="p-6 flex flex-col justify-between border-slate-700/40 hover:border-amber-500/40"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Cloud className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-100 mb-1 leading-snug">
                  {cert.name}
                </h3>

                <p className="text-xs font-medium text-cyan-400 font-mono mb-3">
                  {cert.issuer}
                </p>

                {cert.description && (
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {cert.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Issued: {formatDate(cert.issue_date)}
                  </span>
                  {cert.credential_id && (
                    <span className="text-slate-400 truncate max-w-[130px]">
                      ID: {cert.credential_id}
                    </span>
                  )}
                </div>

                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl glass-panel text-xs text-center font-medium text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Credential
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div className="text-[11px] text-center text-slate-500 font-mono py-1">
                    Verified Completion
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
