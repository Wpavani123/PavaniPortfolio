'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Cpu,
  FolderGit2,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  Code2,
  Layers,
  FileText,
  UserCheck,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  AdminStats,
  Skill,
  SkillProgress,
  Project,
  Certification,
  Experience,
  Education,
  Achievement,
  LeetCodeProfile,
  YouTubeChannel,
  GitHubProfile,
  CustomSection,
  ContactMessage,
  ResumeFile,
  Profile,
} from '@/lib/types';
import GlassCard from '@/components/GlassCard';

type Tab =
  | 'overview'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'experience'
  | 'education'
  | 'achievements'
  | 'journey'
  | 'custom_sections'
  | 'resume'
  | 'profile'
  | 'messages';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progressLogs, setProgressLogs] = useState<SkillProgress[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leetcode, setLeetcode] = useState<LeetCodeProfile | null>(null);
  const [youtube, setYoutube] = useState<YouTubeChannel | null>(null);
  const [github, setGithub] = useState<GitHubProfile | null>(null);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [resume, setResume] = useState<ResumeFile | null>(null);

  // Form modals state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<string | null>(null);

  // Check auth and load data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    api.getMe()
      .then(() => loadAllData())
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/admin/login');
      });
  }, [router]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        profRes,
        skillsRes,
        progRes,
        projRes,
        certRes,
        expRes,
        eduRes,
        achRes,
        leetRes,
        ytRes,
        ghRes,
        customRes,
        msgRes,
        resumeRes,
      ] = await Promise.allSettled([
        api.getAdminStats(),
        api.getProfile(),
        api.getSkills(),
        api.getSkillProgress(),
        api.getProjects(),
        api.getCertifications(),
        api.getExperience(),
        api.getEducation(),
        api.getAchievements(),
        api.getLeetCode(),
        api.getYouTube(),
        api.getGitHub(),
        api.getCustomSectionsAdmin(),
        api.getContactMessages(),
        api.getResume(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (profRes.status === 'fulfilled') setProfile(profRes.value);
      if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value);
      if (progRes.status === 'fulfilled') setProgressLogs(progRes.value);
      if (projRes.status === 'fulfilled') setProjects(projRes.value);
      if (certRes.status === 'fulfilled') setCertifications(certRes.value);
      if (expRes.status === 'fulfilled') setExperience(expRes.value);
      if (eduRes.status === 'fulfilled') setEducation(eduRes.value);
      if (achRes.status === 'fulfilled') setAchievements(achRes.value);
      if (leetRes.status === 'fulfilled') setLeetcode(leetRes.value);
      if (ytRes.status === 'fulfilled') setYoutube(ytRes.value);
      if (ghRes.status === 'fulfilled') setGithub(ghRes.value);
      if (customRes.status === 'fulfilled') setCustomSections(customRes.value);
      if (msgRes.status === 'fulfilled') setMessages(msgRes.value);
      if (resumeRes.status === 'fulfilled') setResume(resumeRes.value);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('token');
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  // --- CRUD Handlers ---

  // Skill Add / Delete
  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
      showNotification('Skill deleted successfully');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Progress Log Add / Delete
  const handleDeleteProgress = async (id: string) => {
    if (!confirm('Delete this progress log entry?')) return;
    try {
      await api.deleteSkillProgress(id);
      setProgressLogs(progressLogs.filter((p) => p.id !== id));
      showNotification('Progress log removed');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Project Delete
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      showNotification('Project deleted successfully');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Cert Delete
  const handleDeleteCert = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await api.deleteCertification(id);
      setCertifications(certifications.filter((c) => c.id !== id));
      showNotification('Certification deleted');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Custom Section Delete
  const handleDeleteCustomSection = async (id: string) => {
    if (!confirm('Delete this custom section?')) return;
    try {
      await api.deleteCustomSection(id);
      setCustomSections(customSections.filter((s) => s.id !== id));
      showNotification('Custom section deleted');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Message Status Update / Delete
  const handleUpdateMessageStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateMessageStatus(id, newStatus);
      setMessages(messages.map((m) => (m.id === id ? updated : m)));
      showNotification(`Message marked as ${newStatus}`);
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.deleteContactMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      showNotification('Message deleted');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Resume Upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newResume = await api.uploadResume(file);
      setResume(newResume);
      showNotification('Resume uploaded and set as active!');
    } catch (err: any) {
      showNotification(err.message || 'Failed to upload resume', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading Admin Career CMS Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom-5 ${
            notification.type === 'success'
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-rose-500 text-white shadow-rose-500/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Career CMS
            </Link>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
              Admin
            </span>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'skills', label: 'Skills & Progress', icon: Cpu },
              { id: 'projects', label: 'Projects Showcase', icon: FolderGit2 },
              { id: 'certifications', label: 'Certifications', icon: Award },
              { id: 'experience', label: 'Experience & Cohorts', icon: Briefcase },
              { id: 'education', label: 'Education Credentials', icon: GraduationCap },
              { id: 'achievements', label: 'Achievements & Events', icon: Trophy },
              { id: 'journey', label: 'LeetCode & YouTube', icon: Code2 },
              { id: 'custom_sections', label: 'Custom Sections', icon: Layers },
              { id: 'resume', label: 'Resume Manager', icon: FileText },
              { id: 'profile', label: 'Profile & Contact Info', icon: UserCheck },
              { id: 'messages', label: `Inquiries (${messages.filter((m) => m.status === 'New').length})`, icon: Mail },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 py-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Public Portfolio</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 py-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main CMS Workspace */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-bold text-white">Career Management Overview</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Real-time metrics, active credentials, and rapid content actions.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Projects', value: stats?.total_projects ?? projects.length, icon: FolderGit2, color: 'text-cyan-400' },
                { label: 'Technical Skills', value: stats?.total_skills ?? skills.length, icon: Cpu, color: 'text-blue-400' },
                { label: 'Certifications', value: stats?.total_certifications ?? certifications.length, icon: Award, color: 'text-amber-400' },
                { label: 'Messages', value: stats?.total_messages ?? messages.length, icon: Mail, color: 'text-emerald-400' },
              ].map((stat, idx) => (
                <GlassCard key={idx} className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">{stat.label}</span>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2 font-mono">
                    {stat.value}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-4">
                Quick Content Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setModalType('add_project');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
                <button
                  onClick={() => {
                    setActiveTab('skills');
                    setModalType('add_skill');
                  }}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-200 hover:text-cyan-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
                <button
                  onClick={() => {
                    setActiveTab('skills');
                    setModalType('log_progress');
                  }}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-200 hover:text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Log Daily Progress
                </button>
                <button
                  onClick={() => {
                    setActiveTab('certifications');
                    setModalType('add_cert');
                  }}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-200 hover:text-amber-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Certification
                </button>
              </div>
            </GlassCard>

            {/* Recent Inquiries List */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Recent Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View All
                </button>
              </div>

              {messages.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No contact inquiries yet.</p>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 3).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-200 block">{msg.name}</span>
                        <span className="text-slate-400">{msg.subject}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          msg.status === 'New'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* TAB 2: SKILLS & PROGRESS */}
        {activeTab === 'skills' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Skills &amp; Daily Progress</h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manage your technical skills matrix and daily learning progress updates.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalType('add_skill')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
                <button
                  onClick={() => setModalType('log_progress')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Log Progress
                </button>
              </div>
            </div>

            {/* Daily Progress Tracker List */}
            <GlassCard className="p-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-4">
                Active Learning Progress Logs
              </h3>
              <div className="space-y-3">
                {progressLogs.map((log) => {
                  const s = skills.find((sk) => sk.id === log.skill_id);
                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">
                            {s ? s.name : 'Skill'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                            {log.status} ({log.progress_percentage}%)
                          </span>
                        </div>
                        <p className="text-slate-400 max-w-xl">{log.learning_note}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProgress(log.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Skills Table */}
            <GlassCard className="p-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-4">
                Technical Skills Database ({skills.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 font-mono text-slate-500">
                    <tr>
                      <th className="py-2.5">Name</th>
                      <th>Category</th>
                      <th>Level</th>
                      <th>Experience</th>
                      <th>Featured</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {skills.map((skill) => (
                      <tr key={skill.id} className="hover:bg-slate-900/40">
                        <td className="py-3 font-semibold text-slate-200">{skill.name}</td>
                        <td className="font-mono text-cyan-400">{skill.category}</td>
                        <td>{skill.level}</td>
                        <td>{skill.years_experience} yrs</td>
                        <td>{skill.is_featured ? '⭐ Yes' : 'No'}</td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Projects Showcase</h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Continuously publish and update your cloud deployments and architectures.
                </p>
              </div>
              <button
                onClick={() => setModalType('add_project')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <GlassCard key={proj.id} className="p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                        {proj.category}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono">{proj.status}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-100">{proj.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {proj.short_description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <Link
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      View Live Page <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Certifications Manager</h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Upload certificates, verify IDs, and highlight verified credentials.
                </p>
              </div>
              <button
                onClick={() => setModalType('add_cert')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Certification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <GlassCard key={cert.id} className="p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400">{cert.issuer}</span>
                    <h3 className="font-bold text-base text-slate-100">{cert.name}</h3>
                    {cert.description && (
                      <p className="text-xs text-slate-400">{cert.description}</p>
                    )}
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      ID: {cert.credential_id || 'N/A'}
                    </span>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: JOURNEY (LeetCode, YouTube, GitHub) */}
        {activeTab === 'journey' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-bold text-white">Developer Journey Hub</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Configure LeetCode metrics, YouTube tutorial feeds, and GitHub profile cards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LeetCode Form */}
              <GlassCard className="p-6 space-y-4">
                <h3 className="font-bold text-base text-amber-400 flex items-center gap-2">
                  <Code2 className="w-5 h-5" /> LeetCode Profile
                </h3>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      const updated = await api.updateLeetCode({
                        total_solved: parseInt(form.total.value),
                        easy: parseInt(form.easy.value),
                        medium: parseInt(form.medium.value),
                        hard: parseInt(form.hard.value),
                        streak: parseInt(form.streak.value),
                        journey_status: form.status.value,
                      });
                      setLeetcode(updated);
                      showNotification('LeetCode stats updated!');
                    } catch (err: any) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Status Banner Message</label>
                    <input
                      name="status"
                      defaultValue={leetcode?.journey_status || 'LeetCode Journey Coming Soon'}
                      className="w-full p-2 rounded-lg glass-input text-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Total Solved</label>
                      <input
                        type="number"
                        name="total"
                        defaultValue={leetcode?.total_solved ?? 0}
                        className="w-full p-2 rounded-lg glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Streak (Days)</label>
                      <input
                        type="number"
                        name="streak"
                        defaultValue={leetcode?.streak ?? 0}
                        className="w-full p-2 rounded-lg glass-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Easy</label>
                      <input
                        type="number"
                        name="easy"
                        defaultValue={leetcode?.easy ?? 0}
                        className="w-full p-2 rounded-lg glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Medium</label>
                      <input
                        type="number"
                        name="medium"
                        defaultValue={leetcode?.medium ?? 0}
                        className="w-full p-2 rounded-lg glass-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Hard</label>
                      <input
                        type="number"
                        name="hard"
                        defaultValue={leetcode?.hard ?? 0}
                        className="w-full p-2 rounded-lg glass-input"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs mt-2"
                  >
                    Save LeetCode Metrics
                  </button>
                </form>
              </GlassCard>

              {/* YouTube Form */}
              <GlassCard className="p-6 space-y-4">
                <h3 className="font-bold text-base text-rose-400 flex items-center gap-2">
                  <Code2 className="w-5 h-5" /> YouTube Channel
                </h3>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      const updated = await api.updateYouTubeChannel({
                        channel_name: form.name.value,
                        channel_url: form.url.value,
                        description: form.desc.value,
                      });
                      setYoutube(updated);
                      showNotification('YouTube channel settings updated!');
                    } catch (err: any) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Channel Name</label>
                    <input
                      name="name"
                      defaultValue={youtube?.channel_name || 'Nimmana Pavani Tech'}
                      className="w-full p-2 rounded-lg glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Channel URL</label>
                    <input
                      name="url"
                      defaultValue={youtube?.channel_url || 'https://youtube.com/'}
                      className="w-full p-2 rounded-lg glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Status Description</label>
                    <textarea
                      name="desc"
                      rows={3}
                      defaultValue={youtube?.description || 'YouTube Content Coming Soon'}
                      className="w-full p-2 rounded-lg glass-input resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs mt-2"
                  >
                    Save YouTube Settings
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        )}

        {/* TAB 9: CUSTOM SECTIONS */}
        {activeTab === 'custom_sections' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Future Custom Sections</h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Add completely new sections to your portfolio (e.g., AI Projects, DevOps Labs, Speaking) without editing frontend code.
                </p>
              </div>
              <button
                onClick={() => setModalType('add_custom_section')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Custom Section
              </button>
            </div>

            <div className="space-y-4">
              {customSections.map((sec) => (
                <GlassCard key={sec.id} className="p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-100">{sec.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                        slug: /{sec.slug}
                      </span>
                    </div>
                    {sec.description && (
                      <p className="text-xs text-slate-400 mt-1">{sec.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCustomSection(sec.id)}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: RESUME MANAGER */}
        {activeTab === 'resume' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-bold text-white">Resume Management</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Upload new resume PDF versions. The portfolio immediately updates everywhere automatically.
              </p>
            </div>

            <GlassCard className="p-8 max-w-xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto">
                <FileText className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-100">
                  {resume?.file_name || 'Nimmana_Pavani_Resume.pdf'}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Active in production &bull; Replaced without code modification
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-colors">
                  <Plus className="w-4 h-4" />
                  Upload New Resume (PDF)
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 11: PROFILE & CONTACT SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-white">Profile &amp; Contact Information</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Update phone, email, headlines, and bio. Changes immediately update across all public sections.
              </p>
            </div>

            <GlassCard className="p-8">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as any;
                  try {
                    const updated = await api.updateProfile({
                      full_name: form.full_name.value,
                      professional_title: form.title.value,
                      headline: form.headline.value,
                      email: form.email.value,
                      phone: form.phone.value,
                      location: form.location.value,
                      short_bio: form.short_bio.value,
                      long_bio: form.long_bio.value,
                    });
                    setProfile(updated);
                    showNotification('Profile and contact details saved successfully!');
                  } catch (err: any) {
                    showNotification(err.message, 'error');
                  }
                }}
                className="space-y-5 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      name="full_name"
                      defaultValue={profile?.full_name || 'Nimmana Pavani'}
                      className="w-full p-2.5 rounded-xl glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Professional Title</label>
                    <input
                      name="title"
                      defaultValue={profile?.professional_title || 'AWS Certified Cloud & DevOps Engineer'}
                      className="w-full p-2.5 rounded-xl glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Hero Subheadline</label>
                  <input
                    name="headline"
                    defaultValue={profile?.headline || 'AWS | Cloud | DevOps | Python | AI Enthusiast'}
                    className="w-full p-2.5 rounded-xl glass-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Contact Email</label>
                    <input
                      name="email"
                      defaultValue={profile?.email || 'pavaninimmana10@gmail.com'}
                      className="w-full p-2.5 rounded-xl glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Contact Phone</label>
                    <input
                      name="phone"
                      defaultValue={profile?.phone || '+91-8121082482'}
                      className="w-full p-2.5 rounded-xl glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Location</label>
                    <input
                      name="location"
                      defaultValue={profile?.location || 'Andhra Pradesh, India'}
                      className="w-full p-2.5 rounded-xl glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Short Bio (Hero &amp; Footer)</label>
                  <textarea
                    name="short_bio"
                    rows={3}
                    defaultValue={profile?.short_bio || ''}
                    className="w-full p-2.5 rounded-xl glass-input resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Long Bio (About Me Section)</label>
                  <textarea
                    name="long_bio"
                    rows={4}
                    defaultValue={profile?.long_bio || ''}
                    className="w-full p-2.5 rounded-xl glass-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25"
                >
                  <Save className="w-4 h-4" /> Save Profile &amp; Contact Details
                </button>
              </form>
            </GlassCard>
          </div>
        )}

        {/* TAB 12: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-2xl font-bold text-white">Contact Inquiries ({messages.length})</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Messages submitted through the public contact form.
              </p>
            </div>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center glass-panel rounded-2xl">
                  No contact messages received yet.
                </p>
              ) : (
                messages.map((msg) => (
                  <GlassCard key={msg.id} className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-100 text-sm">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-xs text-cyan-400 hover:underline">
                          {msg.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={msg.status}
                          onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                          className="text-xs font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200"
                        >
                          <option value="New">New</option>
                          <option value="Read">Read</option>
                          <option value="Replied">Replied</option>
                          <option value="Archived">Archived</option>
                        </select>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-300">
                      Subject: {msg.subject}
                    </div>

                    <p className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {msg.message}
                    </p>
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- ADD / EDIT MODALS --- */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            {/* Modal: Add Skill */}
            {modalType === 'add_skill' && (
              <div>
                <h3 className="font-bold text-lg text-white mb-4">Add Technical Skill</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      const newSkill = await api.createSkill({
                        name: form.name.value,
                        category: form.category.value,
                        level: form.level.value,
                        years_experience: parseFloat(form.years.value),
                        description: form.desc.value,
                        is_featured: form.featured.checked,
                      });
                      setSkills([...skills, newSkill]);
                      setModalType(null);
                      showNotification('Skill created successfully!');
                    } catch (err: any) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Skill Name *</label>
                    <input required name="name" className="w-full p-2.5 rounded-xl glass-input" placeholder="e.g. Kubernetes" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Category *</label>
                    <select name="category" className="w-full p-2.5 rounded-xl glass-input bg-slate-900">
                      <option value="Cloud">Cloud</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Programming">Programming</option>
                      <option value="Data / BI">Data / BI</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Level</label>
                      <select name="level" className="w-full p-2.5 rounded-xl glass-input bg-slate-900">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Years Experience</label>
                      <input type="number" step="0.5" name="years" defaultValue="1.0" className="w-full p-2.5 rounded-xl glass-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description</label>
                    <textarea name="desc" rows={2} className="w-full p-2.5 rounded-xl glass-input resize-none" placeholder="Brief technical summary..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" name="featured" />
                    <label htmlFor="featured" className="text-slate-300">Feature on Home Page</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl glass-panel text-slate-400">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-semibold">Save Skill</button>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: Log Daily Progress */}
            {modalType === 'log_progress' && (
              <div>
                <h3 className="font-bold text-lg text-white mb-4">Log Daily Learning Progress</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      const newLog = await api.addSkillProgress(form.skill_id.value, {
                        progress_date: form.date.value,
                        status: form.status.value,
                        progress_percentage: parseInt(form.percent.value),
                        learning_note: form.note.value,
                        resources: form.resources.value,
                      });
                      setProgressLogs([newLog, ...progressLogs]);
                      setModalType(null);
                      showNotification('Daily progress log saved!');
                    } catch (err: any) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Target Skill *</label>
                    <select name="skill_id" required className="w-full p-2.5 rounded-xl glass-input bg-slate-900">
                      {skills.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Date *</label>
                      <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full p-2.5 rounded-xl glass-input" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Progress Percentage (0-100)</label>
                      <input type="number" name="percent" min="0" max="100" defaultValue="50" required className="w-full p-2.5 rounded-xl glass-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Status Title *</label>
                    <input name="status" required placeholder="e.g. Practicing DSA / Completed Module" className="w-full p-2.5 rounded-xl glass-input" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Learning Note *</label>
                    <textarea name="note" required rows={3} placeholder="What did you learn or practice today?" className="w-full p-2.5 rounded-xl glass-input resize-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Resources Used</label>
                    <input name="resources" placeholder="e.g. AWS Documentation, LeetCode" className="w-full p-2.5 rounded-xl glass-input" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl glass-panel text-slate-400">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-semibold">Save Progress</button>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: Add Project */}
            {modalType === 'add_project' && (
              <div>
                <h3 className="font-bold text-lg text-white mb-4">Add New Cloud / DevOps Project</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      const newProj = await api.createProject({
                        title: form.title.value,
                        slug: form.slug.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                        short_description: form.short_desc.value,
                        full_description: form.full_desc.value,
                        category: form.category.value,
                        technologies: form.tech.value.split(',').map((t: string) => t.trim()).filter(Boolean),
                        github_url: form.github.value || null,
                        live_url: form.live.value || null,
                        status: form.status.value,
                        featured: form.featured.checked,
                      });
                      setProjects([newProj, ...projects]);
                      setModalType(null);
                      showNotification('Project published successfully!');
                    } catch (err: any) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Project Title *</label>
                    <input required name="title" className="w-full p-2.5 rounded-xl glass-input" placeholder="e.g. Serverless Cloud Pipeline" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Slug (URL friendly) *</label>
                    <input required name="slug" className="w-full p-2.5 rounded-xl glass-input" placeholder="serverless-cloud-pipeline" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select name="category" className="w-full p-2.5 rounded-xl glass-input bg-slate-900">
                      <option value="Cloud / DevOps">Cloud / DevOps</option>
                      <option value="AWS Architecture">AWS Architecture</option>
                      <option value="Automation">Automation</option>
                      <option value="AI & Cloud">AI & Cloud</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Technologies (comma separated) *</label>
                    <input required name="tech" className="w-full p-2.5 rounded-xl glass-input" placeholder="AWS Lambda, API Gateway, DynamoDB, Python" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Short Description *</label>
                    <textarea required name="short_desc" rows={2} className="w-full p-2.5 rounded-xl glass-input resize-none" placeholder="Summary for project card..." />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Detailed Specifications &amp; Architecture</label>
                    <textarea name="full_desc" rows={4} className="w-full p-2.5 rounded-xl glass-input resize-none" placeholder="Architecture, components, challenges..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">GitHub URL</label>
                      <input name="github" className="w-full p-2.5 rounded-xl glass-input" placeholder="https://github.com/..." />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Status</label>
                      <select name="status" className="w-full p-2.5 rounded-xl glass-input bg-slate-900">
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Planning">Planning</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="proj_feat" name="featured" defaultChecked />
                    <label htmlFor="proj_feat" className="text-slate-300">Feature on Home Page</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl glass-panel text-slate-400">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-semibold">Publish Project</button>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: Add Certification */}
            {modalType === 'add_cert' && (
              <div>
                <h3 className="font-bold text-lg text-white mb-4">Add Certification</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      const newCert = await api.createCertification({
                        name: form.name.value,
                        issuer: form.issuer.value,
                        credential_id: form.cred_id.value,
                        credential_url: form.cred_url.value,
                        description: form.desc.value,
                        featured: form.featured.checked,
                      });
                      setCertifications([...certifications, newCert]);
                      setModalType(null);
                      showNotification('Certification saved!');
                    } catch (err: any) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Certification Name *</label>
                    <input required name="name" className="w-full p-2.5 rounded-xl glass-input" placeholder="e.g. AWS Certified Developer" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Issuing Organization *</label>
                    <input required name="issuer" className="w-full p-2.5 rounded-xl glass-input" placeholder="e.g. Amazon Web Services" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Credential ID</label>
                      <input name="cred_id" className="w-full p-2.5 rounded-xl glass-input" />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Verification URL</label>
                      <input name="cred_url" className="w-full p-2.5 rounded-xl glass-input" placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description</label>
                    <textarea name="desc" rows={2} className="w-full p-2.5 rounded-xl glass-input resize-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="cert_feat" name="featured" defaultChecked />
                    <label htmlFor="cert_feat" className="text-slate-300">Feature on Home Page</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl glass-panel text-slate-400">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-semibold">Save Certification</button>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: Add Custom Section */}
            {modalType === 'add_custom_section' && (
              <div>
                <h3 className="font-bold text-lg text-white mb-4">Create New Portfolio Section</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      const newSec = await api.createCustomSection({
                        title: form.title.value,
                        slug: form.slug.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                        description: form.desc.value,
                        section_type: form.type.value,
                        is_visible: true,
                        content: [
                          {
                            title: form.item_title.value || 'Milestone 1',
                            badge: 'Phase 1',
                            description: form.item_desc.value || 'Initiative description...',
                            status: 'In Progress',
                          },
                        ],
                      });
                      setCustomSections([...customSections, newSec]);
                      setModalType(null);
                      showNotification('New custom section published to public portfolio!');
                    } catch (err: any) {
                      showNotification(err.message, 'error');
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Section Title *</label>
                    <input required name="title" className="w-full p-2.5 rounded-xl glass-input" placeholder="e.g. AI &amp; LLM Engineering" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Slug (URL identifier) *</label>
                    <input required name="slug" className="w-full p-2.5 rounded-xl glass-input" placeholder="ai-llm-engineering" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description / Subtitle</label>
                    <input name="desc" className="w-full p-2.5 rounded-xl glass-input" placeholder="Exploring generative AI pipelines..." />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Display Layout</label>
                    <select name="type" className="w-full p-2.5 rounded-xl glass-input bg-slate-900">
                      <option value="cards">Cards Grid</option>
                      <option value="timeline">Timeline</option>
                      <option value="rich_text">Rich Content</option>
                    </select>
                  </div>
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="font-semibold text-slate-300">Initial Card Content:</span>
                    <div>
                      <input name="item_title" placeholder="Item title (e.g. RAG on AWS)" className="w-full p-2 rounded-lg glass-input mb-2" />
                      <textarea name="item_desc" rows={2} placeholder="Item description..." className="w-full p-2 rounded-lg glass-input resize-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl glass-panel text-slate-400">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-semibold">Publish Section</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
