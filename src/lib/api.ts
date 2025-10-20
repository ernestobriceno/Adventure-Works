// src/lib/api.ts

export const API_URL = import.meta.env.VITE_API_URL as string;

// Devuelve encabezado de autenticación si hay token guardado
function authHeader(): Record<string, string> {
  const token = localStorage.getItem("aw_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Tipado genérico para fetch JSON
export async function fetchJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Combinamos los encabezados asegurando compatibilidad con HeadersInit
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
    ...authHeader(),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
