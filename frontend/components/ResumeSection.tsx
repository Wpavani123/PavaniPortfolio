'use client';

import React from 'react';
import GlassCard from './GlassCard';
import { FileText, Download, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { ResumeFile } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { resolveResumeUrl } from '@/lib/resume';

interface ResumeSectionProps {
  resume?: ResumeFile | null;
}

export default function ResumeSection({ resume }: ResumeSectionProps) {
  const fileUrl = resolveResumeUrl(resume?.file_url);
  const updatedDate = resume?.uploaded_at ? formatDate(resume.uploaded_at) : 'October 2026';

  return (
    <section id="resume" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            Curriculum Vitae
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Official <span className="text-gradient">Resume</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Verified resume detailing cloud certifications, Linux administration, Python scripting, and academic credentials.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-8 text-center space-y-6 border-cyan-500/30">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
              <FileText className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-100">
                {resume?.file_name || 'Nimmana_Pavani_Resume.pdf'}
              </h3>
              <p className="text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Latest Revision: <span className="text-slate-200">{updatedDate}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={fileUrl}
                download="Nimmana_Pavani_Resume.pdf"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Download PDF Resume
              </a>

              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass-panel text-slate-200 hover:text-cyan-400 text-sm font-semibold transition-all hover:scale-[1.02]"
              >
                <ExternalLink className="w-4 h-4" />
                Preview in Browser
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Managed dynamically via Admin CMS &bull; Always up to date
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
