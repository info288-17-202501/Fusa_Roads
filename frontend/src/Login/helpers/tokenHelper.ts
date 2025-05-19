import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp: number;
  username: string;
  email: string;
}

const BASE_URL = "http://localhost:8000";

export function isExpired(token: string): boolean {
  try {
    const decoded: TokenPayload = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
}

// Función que maneja cualquier request a rutas protegidas
// tokenHelper.ts
export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem("access_token");
  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(input, {
    ...init,
    headers,
  });
}

