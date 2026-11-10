'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import SkillProgressSection from '@/components/SkillProgressSection';
import ProjectsSection from '@/components/ProjectsSection';
import CertificationsSection from '@/components/CertificationsSection';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import AchievementsSection from '@/components/AchievementsSection';
import JourneySection from '@/components/JourneySection';
import CustomSectionsRenderer from '@/components/CustomSectionsRenderer';
import ResumeSection from '@/components/ResumeSection';
import ContactSection from '@/components/ContactSection';

import {
  Profile,
  SocialLink,
  SiteSettings,
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
  ResumeFile,
} from '@/lib/types';
import { api } from '@/lib/api';
import { resolveResumeUrl } from '@/lib/resume';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
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
  const [resume, setResume] = useState<ResumeFile | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const [
          profileRes,
          socialLinksRes,
          settingsRes,
          skillsRes,
          progressRes,
          projectsRes,
          certsRes,
          expRes,
          eduRes,
          achieveRes,
          leetcodeRes,
          youtubeRes,
          githubRes,
          customRes,
          resumeRes,
        ] = await Promise.allSettled([
          api.getProfile(),
          api.getSocialLinks(),
          api.getSiteSettings(),
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
          api.getCustomSections(),
          api.getResume(),
        ]);

        if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
        if (socialLinksRes.status === 'fulfilled') setSocialLinks(socialLinksRes.value);
        if (settingsRes.status === 'fulfilled') setSiteSettings(settingsRes.value);
        if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value);
        if (progressRes.status === 'fulfilled') setProgressLogs(progressRes.value);
        if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value);
        if (certsRes.status === 'fulfilled') setCertifications(certsRes.value);
        if (expRes.status === 'fulfilled') setExperience(expRes.value);
        if (eduRes.status === 'fulfilled') setEducation(eduRes.value);
        if (achieveRes.status === 'fulfilled') setAchievements(achieveRes.value);
        if (leetcodeRes.status === 'fulfilled') setLeetcode(leetcodeRes.value);
        if (youtubeRes.status === 'fulfilled') setYoutube(youtubeRes.value);
        if (githubRes.status === 'fulfilled') setGithub(githubRes.value);
        if (customRes.status === 'fulfilled') setCustomSections(customRes.value);
        if (resumeRes.status === 'fulfilled') setResume(resumeRes.value);
      } catch (err) {
        console.error('Error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (!siteSettings) return;
    document.title = siteSettings.site_title;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', siteSettings.meta_description);
  }, [siteSettings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-xs font-mono text-slate-400">
          Connecting to Cloud Infrastructure &bull; Loading Nimmana Pavani Portfolio...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 text-center">
        <p className="max-w-xl text-sm text-slate-300">
          Portfolio profile data was not returned by the API. Check
          {' '}NEXT_PUBLIC_API_URL, backend health, and that a profile has been configured.
        </p>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Navbar profile={profile} />

      <main>
        {/* 1. Hero Section */}
        <Hero
          profile={profile}
          socials={socialLinks}
          skills={skills}
          resumeUrl={resolveResumeUrl(resume?.file_url)}
        />

        {/* 2. About Me */}
        <AboutSection profile={profile} socials={socialLinks} />

        {/* 3. Core Skills */}
        <SkillsSection skills={skills} />

        {/* 4. Currently Learning & Daily Skill Progress */}
        <SkillProgressSection progressLogs={progressLogs} skills={skills} />

        {/* 5. Featured Projects */}
        <ProjectsSection projects={projects} />

        {/* 6. Certifications */}
        <CertificationsSection certifications={certifications} />

        {/* 7. Experience */}
        <ExperienceSection experience={experience} />

        {/* 8. Education */}
        <EducationSection education={education} />

        {/* 9. Key Achievements & Community Activities */}
        <AchievementsSection achievements={achievements} />

        {/* 10. Developer Journey: GitHub, LeetCode & YouTube */}
        <JourneySection leetcode={leetcode} github={github} youtube={youtube} />

        {/* 11. Dynamic Future / Custom Sections */}
        <CustomSectionsRenderer sections={customSections} />

        {/* 12. Official Resume */}
        <ResumeSection resume={resume} />

        {/* 13. Contact Me */}
        <ContactSection profile={profile} socials={socialLinks} />
      </main>

      <Footer profile={profile} socials={socialLinks} />
    </div>
  );
}
