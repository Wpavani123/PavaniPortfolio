'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GlassCard from './GlassCard';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Cloud,
} from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const filterTags = ['All', 'AWS', 'Cloud', 'DevOps', 'Linux', 'Python'];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.short_description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === 'All' ||
      project.category.toLowerCase().includes(selectedTag.toLowerCase()) ||
      project.technologies.some((t) =>
        t.toLowerCase().includes(selectedTag.toLowerCase())
      );

    return matchesSearch && matchesTag;
  });

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-400 glass-panel uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            Engineering Projects
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Featured <span className="text-gradient">Cloud &amp; DevOps Solutions</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Real-world cloud architectures, automation scripts, and server infrastructure deployments.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'glass-panel text-slate-400 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs glass-input focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-3 text-center py-16 glass-panel rounded-2xl">
              <Cloud className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-200 mb-1">No Projects Found</h3>
              <p className="text-slate-400 text-xs">
                Try adjusting your search criteria or tag filters.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <GlassCard
                key={project.id}
                className="flex flex-col justify-between group overflow-hidden border-slate-700/40 hover:border-cyan-500/50"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {project.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-3 leading-snug">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>

                  {/* Short description */}
                  <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed line-clamp-3">
                    {project.short_description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 5).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-slate-500">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 group/link"
                  >
                    Details & Architecture
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
