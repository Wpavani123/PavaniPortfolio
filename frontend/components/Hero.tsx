'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Download,
  FolderGit2,
  Mail,
  Linkedin,
  Github,
  Cloud,
  Terminal,
  Shield,
  Server,
  ArrowRight,
} from 'lucide-react';
import { Profile } from '@/lib/types';

// Dynamically import 3D scene so it does not block initial page render
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-48 h-48 rounded-full bg-cyan-500/10 blur-2xl animate-pulse" />
    </div>
  ),
});

interface HeroProps {
  profile?: Profile | null;
  resumeUrl?: string;
}

export default function Hero({ profile, resumeUrl = '#resume' }: HeroProps) {
  const headline = profile?.full_name || 'Nimmana Pavani';
  const subheadline =
    profile?.headline || 'AWS | Cloud | DevOps | Python | AI Enthusiast';
  const description =
    profile?.short_bio ||
    'Cloud-focused Computer Science graduate with hands-on experience in AWS, Linux, Python and DevOps technologies, building secure, scalable and cloud-based solutions.';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 3D Background Canvas Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none sm:pointer-events-auto opacity-70 dark:opacity-85">
        <Scene3D />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-cyan-500 dark:text-cyan-400 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>AWS Certified Solutions Architect &bull; Open for Opportunities</span>
          </motion.div>

          {/* Name & Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight">
              <span className="block text-slate-900 dark:text-white">{headline}</span>
              <span className="text-gradient block text-2xl sm:text-3xl xl:text-4xl font-bold mt-2 font-mono">
                {subheadline}
              </span>
            </h1>
          </motion.div>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Core Architecture Highlights Tags */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1"
          >
            {[
              { icon: Cloud, label: 'AWS Architecture (EC2, VPC, IAM)' },
              { icon: Terminal, label: 'Linux Automation' },
              { icon: Server, label: 'DevOps & CI/CD' },
              { icon: Shield, label: 'Cloud Security & Watch' },
            ].map((pill, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg glass-panel text-slate-700 dark:text-slate-300 border-slate-700/30"
              >
                <pill.icon className="w-3.5 h-3.5 text-cyan-400" />
                {pill.label}
              </span>
            ))}
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4"
          >
            <a
              href="#projects"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FolderGit2 className="w-4 h-4" />
              View Projects
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass-panel text-slate-800 dark:text-slate-100 hover:text-cyan-400 text-sm font-semibold border-slate-600/40 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Download Resume
            </a>

            <a
              href="#contact"
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass-panel text-slate-800 dark:text-slate-100 hover:text-cyan-400 text-sm font-semibold border-slate-600/40 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              Contact Me
            </a>
          </motion.div>

          {/* Social Profiles Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-3 pt-3"
          >
            <span className="text-xs text-slate-400 font-mono">Connect:</span>
            <a
              href="https://www.linkedin.com/in/pavani-nimmana-67b989283"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg glass-panel hover:text-cyan-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Wpavani123"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg glass-panel hover:text-cyan-400 transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="mailto:pavaninimmana10@gmail.com"
              className="p-2 rounded-lg glass-panel hover:text-cyan-400 transition-colors"
              title="Email directly"
            >
              <Mail className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Hero Profile Card */}
        <div className="lg:col-span-4 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden shadow-2xl border-cyan-500/20 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/30 transition-colors" />

              {/* Avatar / Terminal Graphic */}
              <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-xl shadow-cyan-500/20 mb-5">
                <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                  <Cloud className="w-10 h-10 text-cyan-400 mb-1" />
                  <span className="text-[10px] font-mono text-slate-300 font-semibold uppercase tracking-wider">
                    Cloud Architect
                  </span>
                </div>
              </div>

              {/* Identity & Credentials */}
              <div className="text-center space-y-1.5 mb-5">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Nimmana Pavani
                </h3>
                <p className="text-xs text-cyan-500 dark:text-cyan-400 font-mono">
                  B.Tech CSE &bull; AWS Certified
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Srikakulam, Andhra Pradesh
                </p>
              </div>

              {/* Quick Spec Highlights */}
              <div className="space-y-2.5 pt-4 border-t border-slate-700/40 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Certification:</span>
                  <span className="font-semibold text-emerald-400 font-mono">AWS SAA-C03</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Core Cloud:</span>
                  <span className="font-medium text-slate-200">EC2 &bull; VPC &bull; IAM</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Automation:</span>
                  <span className="font-medium text-slate-200">Linux &bull; Python</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Daily Learning:</span>
                  <span className="font-medium text-cyan-400">Active DSA & Terraform</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
