import type { ApiEnvelope, PaginationMeta } from "@/types/api";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
export const API_URL = `${API_BASE_URL}/api/v1`;

/** An error returned by the backend, carrying its HTTP status and field-level errors. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: { path?: string; message: string }[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  /** JSON body; serialised automatically. */
  body?: unknown;
  /** Query string params; empty values are skipped. */
  query?: Query;
  /** Bearer token for authenticated endpoints. */
  token?: string | null;
};

const toQueryString = (query?: Query) => {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

async function request<T>(path: string, options: ApiRequestOptions = {}) {
  const { body, query, token, headers, ...init } = options;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}${toQueryString(query)}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("We couldn't reach RaktoSheba. Check your connection and try again.", 0);
  }

  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!envelope) {
    throw new ApiError("The server sent an unexpected response.", response.status);
  }
  if (!envelope.success || !response.ok) {
    const failure = envelope.success ? { message: "Something went wrong.", errors: [] } : envelope;
    throw new ApiError(failure.message || "Something went wrong.", response.status, failure.errors);
  }

  return envelope;
}

/** Calls the API and returns `data`. Works in Server and Client Components. */
export async function api<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return (await request<T>(path, options)).data;
}

/** Like `api`, but also returns pagination `meta` for list endpoints. */
export async function apiPaginated<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<{ data: T; meta: PaginationMeta }> {
  const envelope = await request<T>(path, options);
  return { data: envelope.data, meta: envelope.meta ?? { page: 1, limit: 0, total: 0 } };
}

/** Human-readable message for any thrown value, for toasts and error states. */
export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";
