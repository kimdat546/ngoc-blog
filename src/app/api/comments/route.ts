import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";
import {
  CommentsApiError,
  createComment,
  hashIp,
  listComments,
  sendNotification,
} from "@/lib/comments";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 80;
const EMAIL_MAX = 254;
const CONTENT_MAX = 2000;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postSlug = url.searchParams.get("post_slug");
  if (!postSlug) {
    return NextResponse.json({ error: "Missing post_slug" }, { status: 400 });
  }

  try {
    const comments = await listComments(postSlug);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Comments list error:", error);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, content, postSlug, postId, postTitle, website, turnstileToken } =
    body ?? {};

  // Honeypot
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (typeof postSlug !== "string" || !postSlug) {
    return NextResponse.json({ error: "Missing post" }, { status: 400 });
  }
  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Nội dung không được để trống" }, { status: 400 });
  }
  const trimmedContent = content.trim();
  if (trimmedContent.length > CONTENT_MAX) {
    return NextResponse.json(
      { error: `Nội dung quá dài (tối đa ${CONTENT_MAX} ký tự)` },
      { status: 400 }
    );
  }

  let trimmedName: string | null = null;
  if (typeof name === "string" && name.trim()) {
    trimmedName = name.trim().slice(0, NAME_MAX);
  }

  let trimmedEmail: string | null = null;
  if (typeof email === "string" && email.trim()) {
    const v = email.trim();
    if (v.length > EMAIL_MAX || !EMAIL_RE.test(v)) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }
    trimmedEmail = v;
  }

  if (typeof turnstileToken !== "string" || !turnstileToken) {
    return NextResponse.json(
      { error: "Vui lòng hoàn tất bước xác minh trước khi gửi" },
      { status: 400 }
    );
  }

  const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || null;

  let inserted;
  try {
    inserted = await createComment({
      post_slug: postSlug,
      post_id: typeof postId === "string" ? postId : null,
      name: trimmedName,
      email: trimmedEmail,
      content: trimmedContent,
      ip_hash: remoteIp ? await hashIp(remoteIp) : null,
      turnstile_token: turnstileToken,
      remote_ip: remoteIp,
    });
  } catch (error) {
    if (error instanceof CommentsApiError && error.code === "turnstile_failed") {
      return NextResponse.json(
        { error: "Xác minh không thành công, vui lòng thử lại" },
        { status: 400 }
      );
    }
    console.error("Comments insert error:", error);
    return NextResponse.json({ error: "Không thể lưu bình luận" }, { status: 500 });
  }

  // Notify the author (best-effort, do not block the response on failure)
  try {
    const isAnon = !trimmedName && !trimmedEmail;
    const title = typeof postTitle === "string" && postTitle ? postTitle : postSlug;
    const subject = isAnon
      ? `[Forest Blog] Bình luận ẩn danh mới trên "${title}"`
      : `[Forest Blog] ${trimmedName || trimmedEmail} bình luận trên "${title}"`;
    const postUrl = `${SITE_URL}/post/${postSlug}`;

    const lines: string[] = [];
    lines.push(
      `<p><strong>Bài viết:</strong> <a href="${escapeHtml(postUrl)}">${escapeHtml(title)}</a></p>`
    );
    if (isAnon) {
      lines.push(`<p><strong>Người gửi:</strong> Ẩn danh</p>`);
    } else {
      if (trimmedName) lines.push(`<p><strong>Tên:</strong> ${escapeHtml(trimmedName)}</p>`);
      if (trimmedEmail)
        lines.push(`<p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>`);
    }
    lines.push(`<hr />`);
    lines.push(`<p style="white-space: pre-wrap">${escapeHtml(trimmedContent)}</p>`);

    await sendNotification({
      subject,
      html: lines.join("\n"),
      text: `${title}\n${postUrl}\n\n${trimmedContent}`,
      replyTo: trimmedEmail,
    });
  } catch (err) {
    console.error("Failed to send comment notification:", err);
  }

  return NextResponse.json({ comment: inserted });
}
