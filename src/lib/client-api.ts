import { ApiError, parseEnvelope, toQueryString, type ApiRequestOptions } from "./api";
import type { ApiSuccess, PaginationMeta } from "@/types";

/**
 * Browser-side API client. Every request goes through the same-origin
 * /api/backend proxy, which attaches the httpOnly access token server-side —
 * browser code never touches the token. Used by TanStack Query hooks and
 * client-side mutations so pages don't reload.
 */
const PROXY_BASE = "/api/backend";

async function clientRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiSuccess<T>> {
  // `token` is intentionally ignored: the proxy reads it from the httpOnly cookie.
  const { body, query, headers, ...init } = options;

  let response: Response;
  try {
    response = await fetch(`${PROXY_BASE}${path}${toQueryString(query)}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("We couldn't reach RaktoSheba. Check your connection and try again.", 0);
  }

  return parseEnvelope<T>(response);
}

/** Calls the API through the auth proxy and returns `data`. For Client Components. */
export async function clientApi<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return (await clientRequest<T>(path, options)).data;
}

/** Like `clientApi`, but also returns pagination `meta` for list endpoints. */
export async function clientApiPaginated<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<{ data: T; meta: PaginationMeta }> {
  const envelope = await clientRequest<T>(path, options);
  return { data: envelope.data, meta: envelope.meta ?? { page: 1, limit: 0, total: 0 } };
}

/** Multipart upload (profile photo, licence documents) through the auth proxy. */
export async function clientUpload<T>(path: string, formData: FormData): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${PROXY_BASE}${path}`, { method: "POST", body: formData });
  } catch {
    throw new ApiError("We couldn't reach RaktoSheba. Check your connection and try again.", 0);
  }
  return (await parseEnvelope<T>(response)).data;
}

export { ApiError, errorMessage } from "./api";
