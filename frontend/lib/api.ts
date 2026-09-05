const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data: T; message: string }> {
  const { requiresAuth = false, headers = {}, ...rest } = options;

  const resolvedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('graduation_admin_token');
    if (token) {
      resolvedHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...rest,
      headers: resolvedHeaders,
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined' && requiresAuth) {
        localStorage.removeItem('graduation_admin_token');
        localStorage.removeItem('graduation_admin_user');
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
      throw new Error(data.message || `HTTP Error ${res.status}`);
    }

    return data;
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}
