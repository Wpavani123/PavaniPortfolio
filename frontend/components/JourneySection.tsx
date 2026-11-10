'use client';

import React from 'react';
import GlassCard from './GlassCard';
import {
  Code2,
  Youtube,
  Github,
  ExternalLink,
  Flame,
  Award,
  GitFork,
  Star,
  Play,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LeetCodeProfile, GitHubProfile, YouTubeChannel } from '@/lib/types';

interface JourneySectionProps {
  leetcode?: LeetCodeProfile | null;
  github?: GitHubProfile | null;
  youtube?: YouTubeChannel | null;
}

export default function JourneySection({
  leetcode,
  github,
  youtube,
}: JourneySectionProps) {
  if (!github && !leetcode && !youtube) return null;

  return (
    <section id="journey" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            Developer Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            GitHub, <span className="text-gradient">LeetCode &amp; Media</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Tracking algorithmic problem solving, open-source repositories, and technical educational content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: GitHub Hub */}
          {github && (
          <GlassCard className="p-6 flex flex-col justify-between border-slate-700/40">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white">
                  <Github className="w-5 h-5" />
                </div>
                <a
                  href={github.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  @{github.username}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h3 className="font-bold text-lg text-slate-100 mb-2">GitHub Repositories</h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                {github.bio}
              </p>

              {/* Pinned Repos */}
              <div className="space-y-3 mb-6">
                {(github.pinned_repos || []).map((repo, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                  >
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-cyan-400 hover:underline flex items-center justify-between"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                      <span className="text-slate-300">{repo.language}</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <GitFork className="w-3 h-3" /> {repo.forks}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Public Repositories:</span>
              <span className="text-white font-bold">{github.public_repos ?? '—'}</span>
            </div>
          </GlassCard>
          )}

          {/* Card 2: LeetCode Hub */}
          {leetcode && (
          <GlassCard className="p-6 flex flex-col justify-between border-slate-700/40">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <a
                  href={leetcode.profile_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  LeetCode Profile
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h3 className="font-bold text-lg text-slate-100 mb-2">LeetCode Problem Solving</h3>

              {leetcode?.total_solved && leetcode.total_solved > 0 ? (
                <div className="space-y-4 my-5">
                  <div className="text-center p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-3xl font-extrabold text-amber-400 font-mono">
                      {leetcode.total_solved}
                    </span>
                    <span className="block text-xs text-slate-400 mt-1">Problems Solved</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <span className="block font-bold">{leetcode.easy}</span>
                      <span className="text-[10px] text-slate-400">Easy</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <span className="block font-bold">{leetcode.medium}</span>
                      <span className="text-[10px] text-slate-400">Medium</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <span className="block font-bold">{leetcode.hard}</span>
                      <span className="text-[10px] text-slate-400">Hard</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty but ready state */
                <div className="my-6 p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
                  <Clock className="w-8 h-8 text-amber-400/80 mx-auto animate-pulse" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">
                      {leetcode.journey_status || 'No activity details published.'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      No problem-solving statistics are available.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Current Streak:
              </span>
              <span className="text-slate-200 font-bold">{leetcode.streak ?? '—'} days</span>
            </div>
          </GlassCard>
          )}

          {/* Card 3: YouTube Hub */}
          {youtube && (
          <GlassCard className="p-6 flex flex-col justify-between border-slate-700/40">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Youtube className="w-5 h-5" />
                </div>
                <a
                  href={youtube.channel_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
                >
                  YouTube Channel
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h3 className="font-bold text-lg text-slate-100 mb-2">
                {youtube.channel_name}
              </h3>

              {youtube?.videos && youtube.videos.length > 0 ? (
                <div className="space-y-3 my-4">
                  {youtube.videos.map((vid) => (
                    <a
                      key={vid.id}
                      href={vid.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 hover:border-rose-500/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-slate-200 truncate">
                          {vid.title}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {vid.category}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                /* Empty but ready state */
                <div className="my-6 p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
                  <Youtube className="w-8 h-8 text-rose-400/80 mx-auto animate-pulse" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">
                      No videos published.
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      No video entries are available.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Subscribers:</span>
              <span className="text-slate-200 font-bold">{youtube.subscriber_count ?? '—'}</span>
            </div>
          </GlassCard>
          )}
        </div>
      </div>
    </section>
  );
}
