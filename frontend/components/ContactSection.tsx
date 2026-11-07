'use client';

import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Mail, Phone, Linkedin, Github, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Profile } from '@/lib/types';
import { api } from '@/lib/api';

interface ContactSectionProps {
  profile?: Profile | null;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const email = profile?.email || 'pavaninimmana10@gmail.com';
  const phone = profile?.phone || '+91-8121082482';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      await api.sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            Let's Connect
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Interested in cloud architecture, AWS infrastructure, DevOps automation, or technical collaborations? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-8 space-y-6 border-cyan-500/20">
              <h3 className="text-xl font-bold text-slate-100">
                Contact Information
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Open to discussions regarding Cloud/DevOps Fresher roles, AWS Solutions Architect opportunities, and innovative tech projects.
              </p>

              {/* Direct Info */}
              <div className="space-y-4">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-mono uppercase">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {email}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-mono uppercase">
                      Direct Phone
                    </span>
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                      {phone}
                    </span>
                  </div>
                </a>
              </div>

              {/* Action Buttons: Email Me, Call Me, LinkedIn, GitHub */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`mailto:${email}`}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Me
                </a>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 rounded-xl glass-panel text-slate-200 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Call Me
                </a>
                <a
                  href="https://www.linkedin.com/in/pavani-nimmana-67b989283"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl glass-panel text-slate-200 hover:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Wpavani123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Github className="w-3.5 h-3.5 text-slate-300" />
                  GitHub
                </a>
              </div>
            </GlassCard>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-slate-100 mb-6">
                Send a Message
              </h3>

              {success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Thank you! Your message has been sent successfully. I will get back to you shortly.</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Engineer Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
