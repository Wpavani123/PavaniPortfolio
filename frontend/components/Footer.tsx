'use client';

import React from 'react';
import Link from 'next/link';
import { Cloud, Mail, Phone, Linkedin, Github, Shield, Heart } from 'lucide-react';
import { Profile, SocialLink } from '@/lib/types';

interface FooterProps {
  profile?: Profile | null;
  socials?: SocialLink[];
}

export default function Footer({ profile, socials }: FooterProps) {
  const email = profile?.email || 'pavaninimmana10@gmail.com';
  const phone = profile?.phone || '+91-8121082482';

  return (
    <footer className="border-t border-slate-700/40 relative z-10 bg-slate-950/60 backdrop-blur-md pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Bio & Candidate identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Cloud className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">
                {profile?.full_name || 'Nimmana Pavani'}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {profile?.short_bio ||
                'AWS Certified Cloud/DevOps fresher with hands-on AWS, Linux, Python and DevOps knowledge, building secure, scalable and cloud-based solutions.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 glass-panel px-3 py-1.5 rounded-lg transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 glass-panel px-3 py-1.5 rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {phone}
              </a>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-cyan-400 transition-colors">
                  Technical Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-cyan-400 transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#certifications" className="hover:text-cyan-400 transition-colors">
                  Certifications
                </a>
              </li>
              <li>
                <a href="#journey" className="hover:text-cyan-400 transition-colors">
                  LeetCode & GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Connect & Socials */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-4">
              Social Profiles
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://www.linkedin.com/in/pavani-nimmana-67b989283"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn Profile</span>
              </a>
              <a
                href="https://github.com/Wpavani123"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Github className="w-4 h-4 text-slate-300" />
                <span>GitHub @Wpavani123</span>
              </a>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 mt-3 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin CMS Access</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Nimmana Pavani. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Engineered with Next.js, FastAPI & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
