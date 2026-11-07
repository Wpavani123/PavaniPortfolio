const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const DEFAULT_RESUME_URL = '/Nimmana_Pavani_Resume.pdf';

export function resolveResumeUrl(fileUrl?: string | null): string {
  if (!fileUrl) return DEFAULT_RESUME_URL;

  const frontendOrigin =
    typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin;
  const apiOrigin = new URL(API_BASE, frontendOrigin).origin;
  const normalizedPath = fileUrl.startsWith('/uploads/')
    ? `/api${fileUrl}`
    : fileUrl;

  return new URL(normalizedPath, apiOrigin).toString();
}
