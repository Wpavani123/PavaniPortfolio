'use client';

import React from 'react';
import GlassCard from './GlassCard';
import {
  Server,
  Cloud,
  Terminal,
  Activity,
  ShieldCheck,
  TrendingDown,
  Mail,
  Phone,
  Linkedin,
  Github,
  Award,
} from 'lucide-react';
import { Profile } from '@/lib/types';

interface AboutSectionProps {
  profile?: Profile | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  const email = profile?.email || 'pavaninimmana10@gmail.com';
  const phone = profile?.phone || '+91-8121082482';

  const competencies = [
    {
      icon: Cloud,
      title: 'Cloud Architecture & AWS Services',
      description: 'Hands-on provisioning and governance of AWS EC2, VPC, subnets, route tables, IAM roles, and S3 storage with AWS best practices.',
    },
    {
      icon: Terminal,
      title: 'Linux Systems & Shell Automation',
      description: 'Administration of Amazon Linux environments, package setups, user permissions, systemctl services, and Bash automation.',
    },
    {
      icon: Activity,
      title: 'Monitoring & Observability',
      description: 'Configuring AWS CloudWatch alarms, CPU utilization thresholds, and system health status checks for proactive issue detection.',
    },
    {
      icon: TrendingDown,
      title: 'Cost Governance & Optimization',
      description: 'Designing cloud deployments strictly within AWS Free Tier limits and optimizing compute lifecycle to eliminate unnecessary spend.',
    },
    {
      icon: ShieldCheck,
      title: 'Security & Least Privilege Access',
      description: 'Enforcing granular Security Group firewalls, restricting open ingress ports, and binding IAM policies to instances.',
    },
    {
      icon: Server,
      title: 'CI/CD & DevOps Foundations',
      description: 'Utilizing Git/GitHub, Docker containers, and automation pipelines to streamline software releases and infrastructure delivery.',
    },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Background & Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About <span className="text-gradient">Nimmana Pavani</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {profile?.long_bio ||
              'Computer Science Engineering graduate specializing in Cloud Architecture and DevOps automation. AWS Certified Solutions Architect - Associate with hands-on experience in building secure, scalable, and automated cloud deployments.'}
          </p>
        </div>

        {/* Contact Info Quick Access Strip */}
        <div className="mb-12">
          <GlassCard className="bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 border-cyan-500/20 py-4">
            <div className="flex flex-wrap items-center justify-around gap-4 text-center sm:text-left">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-mono">Email</span>
                  <span className="font-semibold">{email}</span>
                </div>
              </a>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-mono">Phone</span>
                  <span className="font-semibold">{phone}</span>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/pavani-nimmana-67b989283"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-mono">LinkedIn</span>
                  <span className="font-semibold">pavani-nimmana</span>
                </div>
              </a>

              <a
                href="https://github.com/Wpavani123"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-mono">GitHub</span>
                  <span className="font-semibold">@Wpavani123</span>
                </div>
              </a>
            </div>
          </GlassCard>
        </div>

        {/* Competencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competencies.map((comp, idx) => (
            <GlassCard key={idx} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <comp.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-100">
                  {comp.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {comp.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
