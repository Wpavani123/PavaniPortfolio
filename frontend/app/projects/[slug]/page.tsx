'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassCard from '@/components/GlassCard';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Layers,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cloud,
  Terminal,
  Shield,
  Loader2,
} from 'lucide-react';
import { Project } from '@/lib/types';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.getProjectBySlug(slug)
      .then((data) => {
        setProject(data);
      })
      .catch((err) => {
        setError(err.message || 'Project not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading project architecture &amp; telemetry...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <Cloud className="w-16 h-16 text-slate-600 mb-4" />
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Project Not Found</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          The requested cloud architecture or project specification does not exist or has been relocated.
        </p>
        <Link
          href="/#projects"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-medium text-xs flex items-center gap-2 hover:bg-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {project.category}
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Status: {project.status}
            </span>
            {project.start_date && (
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1 ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(project.start_date)} – {project.end_date ? formatDate(project.end_date) : 'Present'}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {project.short_description}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors"
              >
                <Github className="w-4 h-4" />
                View GitHub Source
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Live Deployment
              </a>
            )}
          </div>
        </div>

        {/* Tech Stack Banner */}
        <GlassCard className="p-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
            Technology Stack &amp; AWS Services
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900/80 text-cyan-400 border border-cyan-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Architecture & Implementation Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <GlassCard className="p-8 prose prose-invert max-w-none">
              <h2 className="text-xl font-bold text-white mb-4">Architecture &amp; Specifications</h2>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {project.full_description}
              </div>
            </GlassCard>
          </div>

          {/* Key Insights & Architectural Highlights */}
          <div className="space-y-6">
            <GlassCard className="p-6 space-y-4 border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Key Architectural Wins
              </div>
              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li>&bull; Strict least-privilege IAM roles attached to instances</li>
                <li>&bull; Isolated public subnet with dedicated Internet Gateway</li>
                <li>&bull; Stateful security group restricting unauthorized ports</li>
                <li>&bull; Proactive CloudWatch alerts on high CPU thresholds</li>
                <li>&bull; Kept operational costs 100% within AWS Free Tier limits</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6 space-y-4 border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                What I Learned
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deepened practical intuition for custom CIDR routing, VPC route table association, Apache service management under systemd on Amazon Linux, and Linux log audits.
              </p>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
