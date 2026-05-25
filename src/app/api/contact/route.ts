import { NextResponse } from "next/server";
import { Resend } from "resend";

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !to) {
    console.error("Contact form is not configured (missing env vars)");
    return NextResponse.json(
      { error: "Server is not configured" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "My Forest Blog <onboarding@resend.dev>",
      to: [to],
      replyTo: trimmed.email,
      subject: `[Forest Blog] ${trimmed.subject}`,
      html: `
        <h2>New message from ${escapeHtml(trimmed.name)}</h2>
        <p><strong>Email:</strong> ${escapeHtml(trimmed.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(trimmed.subject)}</p>
        <hr />
        <p style="white-space: pre-wrap">${escapeHtml(trimmed.message)}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending contact email:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
