// Server-only client for the comments Worker (workers/comments).
// The API secret must never reach the browser.

const apiUrl = process.env.COMMENTS_API_URL;
const apiSecret = process.env.COMMENTS_API_SECRET;

export interface CommentRow {
  id: string;
  name: string | null;
  email: string | null;
  content: string;
  created_at: string;
}

export interface NewComment {
  post_slug: string;
  post_id: string | null;
  name: string | null;
  email: string | null;
  content: string;
  ip_hash: string | null;
  turnstile_token: string;
  remote_ip: string | null;
}

export class CommentsApiError extends Error {
  constructor(public status: number, public code: string) {
    super(`Comments API error ${status}: ${code}`);
  }
}

async function callWorker<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiUrl || !apiSecret) {
    throw new CommentsApiError(500, "not_configured");
  }
  const res = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiSecret}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new CommentsApiError(res.status, data.error || "unknown");
  }
  return data as T;
}

export async function listComments(postSlug: string): Promise<CommentRow[]> {
  const data = await callWorker<{ comments: CommentRow[] }>(
    `/comments?post_slug=${encodeURIComponent(postSlug)}`
  );
  return data.comments ?? [];
}

export async function createComment(input: NewComment): Promise<CommentRow> {
  const data = await callWorker<{ comment: CommentRow }>("/comments", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.comment;
}

export async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${ip}:${apiSecret ?? ""}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
