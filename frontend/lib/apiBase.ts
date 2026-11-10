const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '');

const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, '');

export const API_BASE = normalizedApiUrl
  ? normalizedApiUrl.endsWith('/api')
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : '';
