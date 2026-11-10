import {
  Profile,
  SocialLink,
  Skill,
  SkillProgress,
  Project,
  ProjectImage,
  Certification,
  Experience,
  Education,
  Achievement,
  LeetCodeProfile,
  YouTubeChannel,
  YouTubeVideo,
  GitHubProfile,
  CustomSection,
  ContactMessage,
  ResumeFile,
  SiteSettings,
  AdminStats,
  User,
} from './types';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '')
).replace(/\/+$/, '');

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // --- Public Read Endpoints ---
  async getProfile(): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch site settings');
    return res.json();
  }

  async getSocialLinks(): Promise<SocialLink[]> {
    const res = await fetch(`${API_BASE}/social-links`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch social links');
    return res.json();
  }

  async getSkills(category?: string): Promise<Skill[]> {
    const url = new URL(`${API_BASE}/skills`);
    if (category && category !== 'All') url.searchParams.append('category', category);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  }

  async getSkillProgress(): Promise<SkillProgress[]> {
    const res = await fetch(`${API_BASE}/skills/progress/all`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch skill progress');
    return res.json();
  }

  async getProjects(params?: { category?: string; featured?: boolean; search?: string }): Promise<Project[]> {
    const url = new URL(`${API_BASE}/projects`);
    if (params?.category && params.category !== 'All') url.searchParams.append('category', params.category);
    if (params?.featured !== undefined) url.searchParams.append('featured', String(params.featured));
    if (params?.search) url.searchParams.append('search', params.search);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  }

  async getCertifications(featured?: boolean): Promise<Certification[]> {
    const url = new URL(`${API_BASE}/certifications`);
    if (featured !== undefined) url.searchParams.append('featured', String(featured));
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch certifications');
    return res.json();
  }

  async getExperience(): Promise<Experience[]> {
    const res = await fetch(`${API_BASE}/experience`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch experience');
    return res.json();
  }

  async getEducation(): Promise<Education[]> {
    const res = await fetch(`${API_BASE}/education`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch education');
    return res.json();
  }

  async getAchievements(): Promise<Achievement[]> {
    const res = await fetch(`${API_BASE}/achievements`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return res.json();
  }

  async getLeetCode(): Promise<LeetCodeProfile> {
    const res = await fetch(`${API_BASE}/leetcode`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch LeetCode profile');
    return res.json();
  }

  async getYouTube(): Promise<YouTubeChannel> {
    const res = await fetch(`${API_BASE}/youtube`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch YouTube info');
    return res.json();
  }

  async getGitHub(): Promise<GitHubProfile> {
    const res = await fetch(`${API_BASE}/github`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch GitHub profile');
    return res.json();
  }

  async getCustomSections(): Promise<CustomSection[]> {
    const res = await fetch(`${API_BASE}/custom-sections`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch custom sections');
    return res.json();
  }

  async getResume(): Promise<ResumeFile> {
    const res = await fetch(`${API_BASE}/resume`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch resume');
    return res.json();
  }

  async sendContactMessage(data: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to send message');
    }
    return res.json();
  }

  // --- Admin Authentication ---
  async login(admin_name: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  }

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  }

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  }

  // --- Admin Mutators ---
  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  }

  // Skills
  async createSkill(data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create skill');
    return res.json();
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update skill');
    return res.json();
  }

  async deleteSkill(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete skill');
  }

  async addSkillProgress(skillId: string, data: any): Promise<SkillProgress> {
    const res = await fetch(`${API_BASE}/skills/${skillId}/progress`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log skill progress');
    return res.json();
  }

  async deleteSkillProgress(progressId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/skills/progress/${progressId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete progress log');
  }

  // Projects
  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  }

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
  }

  // Certifications
  async createCertification(data: Partial<Certification>): Promise<Certification> {
    const res = await fetch(`${API_BASE}/certifications`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create certification');
    return res.json();
  }

  async updateCertification(id: string, data: Partial<Certification>): Promise<Certification> {
    const res = await fetch(`${API_BASE}/certifications/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update certification');
    return res.json();
  }

  async deleteCertification(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/certifications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete certification');
  }

  // Experience
  async createExperience(data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_BASE}/experience`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create experience');
    return res.json();
  }

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_BASE}/experience/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
  }

  async deleteExperience(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/experience/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete experience');
  }

  // Education
  async createEducation(data: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_BASE}/education`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create education');
    return res.json();
  }

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update education');
    return res.json();
  }

  async deleteEducation(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete education');
  }

  // Achievements
  async createAchievement(data: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create achievement');
    return res.json();
  }

  async updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement> {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update achievement');
    return res.json();
  }

  async deleteAchievement(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete achievement');
  }

  // LeetCode
  async updateLeetCode(data: Partial<LeetCodeProfile>): Promise<LeetCodeProfile> {
    const res = await fetch(`${API_BASE}/leetcode`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update LeetCode');
    return res.json();
  }

  // YouTube
  async updateYouTubeChannel(data: Partial<YouTubeChannel>): Promise<YouTubeChannel> {
    const res = await fetch(`${API_BASE}/youtube/channel`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update YouTube channel');
    return res.json();
  }

  async addYouTubeVideo(data: Partial<YouTubeVideo>): Promise<YouTubeVideo> {
    const res = await fetch(`${API_BASE}/youtube/videos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add video');
    return res.json();
  }

  async deleteYouTubeVideo(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/youtube/videos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete video');
  }

  // GitHub
  async updateGitHubProfile(data: Partial<GitHubProfile>): Promise<GitHubProfile> {
    const res = await fetch(`${API_BASE}/github`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update GitHub profile');
    return res.json();
  }

  // Custom Sections
  async getCustomSectionsAdmin(): Promise<CustomSection[]> {
    const res = await fetch(`${API_BASE}/custom-sections/all`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch custom sections');
    return res.json();
  }

  async createCustomSection(data: Partial<CustomSection>): Promise<CustomSection> {
    const res = await fetch(`${API_BASE}/custom-sections`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create custom section');
    return res.json();
  }

  async updateCustomSection(id: string, data: Partial<CustomSection>): Promise<CustomSection> {
    const res = await fetch(`${API_BASE}/custom-sections/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update custom section');
    return res.json();
  }

  async deleteCustomSection(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/custom-sections/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete custom section');
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/contact/messages`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  }

  async updateMessageStatus(id: string, status: string): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/contact/messages/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update message status');
    return res.json();
  }

  async deleteContactMessage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/contact/messages/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete message');
  }

  // Resume Upload
  async uploadResume(file: File): Promise<ResumeFile> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload resume');
    return res.json();
  }

  // File Upload
  async uploadFile(file: File, folder: string = 'common'): Promise<{ url: string; filename: string }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  }
}

export const api = new ApiClient();
