import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Called by a Contentful webhook on publish/unpublish so new or edited content
// shows up immediately instead of waiting for the 10-minute ISR refresh.
// Header: x-revalidate-secret: <REVALIDATE_SECRET>
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Posts, categories and the header menu are shared across pages, so refresh everything.
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
