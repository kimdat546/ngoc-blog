// Backend for the blog: comments (D1) and owner notification emails. Only the
// Next.js server calls this Worker (authenticated with API_SECRET); browsers
// never talk to it directly.

// Secrets aren't in wrangler.jsonc, so `wrangler types` doesn't know about them.
declare global {
  interface Env {
    API_SECRET?: string;
    TURNSTILE_SECRET?: string;
    NOTIFY_TO?: string;
  }
}

interface CommentInput {
  post_slug: string;
  post_id?: string | null;
  name?: string | null;
  email?: string | null;
  content: string;
  ip_hash?: string | null;
  turnstile_token?: string;
  remote_ip?: string | null;
}

interface NotifyInput {
  subject: string;
  html: string;
  text?: string;
  reply_to?: string | null;
}

const COLUMNS = "id, name, email, content, created_at";
const NOTIFY_FROM = { name: "My Forest Blog", email: "blog@hypercoding.dev" };

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function isAuthorized(request: Request, secret: string | undefined) {
  if (!secret) return false;
  const header = request.headers.get("Authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = new TextEncoder().encode(header);
  const b = new TextEncoder().encode(expected);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string | null | undefined,
  secret: string
) {
  if (!token) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form }
  );
  const outcome = await res.json<{ success: boolean }>();
  return outcome.success === true;
}

async function listComments(env: Env, postSlug: string) {
  const { results } = await env.DB.prepare(
    `select ${COLUMNS} from comments where post_slug = ? order by created_at desc limit 200`
  )
    .bind(postSlug)
    .all();
  return json({ comments: results });
}

async function createComment(env: Env, input: CommentInput) {
  if (typeof input.post_slug !== "string" || !input.post_slug) {
    return json({ error: "Missing post_slug" }, 400);
  }
  if (typeof input.content !== "string" || !input.content.trim()) {
    return json({ error: "Missing content" }, 400);
  }

  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(
      input.turnstile_token,
      input.remote_ip,
      env.TURNSTILE_SECRET
    );
    if (!ok) return json({ error: "turnstile_failed" }, 403);
  }

  const comment = await env.DB.prepare(
    `insert into comments (id, post_slug, post_id, name, email, content, ip_hash)
     values (?, ?, ?, ?, ?, ?, ?)
     returning ${COLUMNS}`
  )
    .bind(
      crypto.randomUUID(),
      input.post_slug,
      input.post_id ?? null,
      input.name ?? null,
      input.email ?? null,
      input.content,
      input.ip_hash ?? null
    )
    .first();

  return json({ comment }, 201);
}

// Emails the blog owner (contact form, new comments). The recipient is fixed
// to NOTIFY_TO, a verified Email Routing destination, so callers can't pick it.
async function notify(env: Env, input: NotifyInput) {
  if (!env.NOTIFY_TO) return json({ error: "not_configured" }, 500);
  if (typeof input.subject !== "string" || !input.subject || typeof input.html !== "string" || !input.html) {
    return json({ error: "Missing subject or html" }, 400);
  }
  const { messageId } = await env.EMAIL.send({
    from: NOTIFY_FROM,
    to: env.NOTIFY_TO,
    subject: input.subject.slice(0, 250),
    html: input.html,
    text: input.text,
    replyTo: input.reply_to || undefined,
  });
  return json({ ok: true, messageId });
}

export default {
  async fetch(request, env): Promise<Response> {
    if (!isAuthorized(request, env.API_SECRET)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const url = new URL(request.url);

    if (url.pathname === "/notify") {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      try {
        return await notify(env, await request.json<NotifyInput>());
      } catch (err) {
        console.error("Notify error:", err);
        return json({ error: "send_failed" }, 502);
      }
    }

    if (url.pathname !== "/comments") {
      return json({ error: "Not found" }, 404);
    }

    try {
      if (request.method === "GET") {
        const postSlug = url.searchParams.get("post_slug");
        if (!postSlug) return json({ error: "Missing post_slug" }, 400);
        return await listComments(env, postSlug);
      }

      if (request.method === "POST") {
        let input: CommentInput;
        try {
          input = await request.json<CommentInput>();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        return await createComment(env, input);
      }

      return json({ error: "Method not allowed" }, 405);
    } catch (err) {
      console.error("Comments worker error:", err);
      return json({ error: "Internal error" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
