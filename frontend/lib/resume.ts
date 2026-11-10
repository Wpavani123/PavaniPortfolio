const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '')
).replace(/\/+$/, '');

export function resolveResumeUrl(fileUrl?: string | null): string | null {
  if (!fileUrl) return null;

  const frontendOrigin =
    typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin;
  const apiOrigin = API_BASE ? new URL(API_BASE, frontendOrigin).origin : frontendOrigin;
  const normalizedPath = fileUrl.startsWith('/uploads/')
    ? `/api${fileUrl}`
    : fileUrl;

  return new URL(normalizedPath, apiOrigin).toString();
}
