export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Shared API client.
 * - Always sends cookies (credentials: "include") so every authenticated
 *   request carries the session, regardless of future origin splits.
 * - Parses JSON safely and converts non-2xx responses into typed ApiError
 *   using the backend `{ error }` envelope.
 * - Dispatches a `razr:unauthorized` event on 401 so the auth provider can
 *   clear the stale session immediately.
 */
export async function apiFetch<T = unknown>(input: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(input, {
      credentials: "include",
      ...init,
      headers: {
        ...(init?.body !== undefined && !(init?.headers instanceof Headers && init.headers.has("Content-Type"))
          ? { "Content-Type": "application/json" }
          : {}),
        ...(init?.headers || {}),
      },
    });
  } catch (err: any) {
    throw new ApiError(0, err?.message || "Network connection error.");
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed with status ${res.status}.`;
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent("razr:unauthorized"));
    }
    throw new ApiError(res.status, message);
  }

  return data as T;
}