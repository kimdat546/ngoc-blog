import { NextResponse } from "next/server";
import { sendNotification } from "@/lib/comments";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, subject, message, website } = body ?? {};

  // Honeypot: real users won't fill this hidden field; bots will.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const trimmed = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  if (!trimmed.name || trimmed.name.length > 120) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!EMAIL_RE.test(trimmed.email) || trimmed.email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!trimmed.subject || trimmed.subject.length > 200) {
    return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
  }
  if (!trimmed.message || trimmed.message.length > 5000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  try {
    await sendNotification({
      subject: `[Forest Blog] ${trimmed.subject}`,
      replyTo: trimmed.email,
      html: `
        <h2>New message from ${escapeHtml(trimmed.name)}</h2>
        <p><strong>Email:</strong> ${escapeHtml(trimmed.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(trimmed.subject)}</p>
        <hr />
        <p style="white-space: pre-wrap">${escapeHtml(trimmed.message)}</p>
      `,
      text: `${trimmed.name} <${trimmed.email}>\n${trimmed.subject}\n\n${trimmed.message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 502 }
    );
  }
}
