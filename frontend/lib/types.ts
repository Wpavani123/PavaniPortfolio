export interface Profile {
  id: string;
  full_name: string;
  professional_title: string;
  headline: string;
  phone: string;
  email: string;
  location: string;
  short_bio: string;
  long_bio: string;
  profile_image: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  username: string | null;
  url: string;
  icon: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillProgress {
  id: string;
  skill_id: string;
  progress_date: string;
  status: string;
  progress_percentage: number;
  learning_note: string;
  resources: string | null;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  years_experience: number;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  progress_entries?: SkillProgress[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  demo_url: string | null;
  video_url: string | null;
  image: string | null;
  featured: boolean;
  status: string;
  start_date: string | null;
  end_date: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  certificate_file: string | null;
  certificate_image: string | null;
  description: string | null;
  display_order: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  type: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  technologies: string[];
  logo: string | null;
  certificate: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  start_year: string;
  end_year: string;
  grade: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string | null;
  date: string | null;
  description: string;
  image: string | null;
  certificate: string | null;
  link: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface LeetCodeProfile {
  id: string;
  username: string;
  profile_url: string;
  total_solved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
  streak: number;
  journey_status: string;
  last_updated: string;
}

export interface YouTubeVideo {
  id: string;
  channel_id: string | null;
  title: string;
  video_url: string;
  thumbnail: string | null;
  description: string | null;
  published_date: string | null;
  category: string;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface YouTubeChannel {
  id: string;
  channel_name: string;
  channel_url: string;
  subscriber_count: number;
  description: string;
  banner_image: string | null;
  created_at: string;
  updated_at: string;
  videos?: YouTubeVideo[];
}

export interface GitHubProfile {
  id: string;
  username: string;
  profile_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string | null;
  pinned_repos: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
  }>;
  updated_at: string;
}

export interface CustomSection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  cover_image: string | null;
  content: any;
  section_type: 'cards' | 'rich_text' | 'timeline' | 'grid';
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  created_at: string;
}

export interface ResumeFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  is_active: boolean;
  uploaded_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  meta_description: string;
  keywords: string;
  hero_subheadline: string;
  hero_tagline: string;
  allow_contact_form: boolean;
  theme_default: string;
  updated_at: string;
}

export interface AdminStats {
  total_projects: number;
  total_skills: number;
  total_certifications: number;
  total_achievements: number;
  total_messages: number;
  unread_messages: number;
  custom_sections_count: number;
  leetcode_solved: number;
  recent_messages: ContactMessage[];
  recent_progress: SkillProgress[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
