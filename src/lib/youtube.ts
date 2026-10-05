import { INLINES, type Block, type Inline } from "@contentful/rich-text-types";

// Parses common YouTube URL formats and returns { videoId, start } or null.
export function parseYouTubeUrl(url: string): { videoId: string; start?: number } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = u.pathname.slice(1).split("/")[0] || null;
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") {
        videoId = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        videoId = u.pathname.split("/")[2] || null;
      } else if (u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.split("/")[2] || null;
      }
    }

    if (!videoId || !/^[A-Za-z0-9_-]{6,}$/.test(videoId)) return null;

    const tParam = u.searchParams.get("t") || u.searchParams.get("start");
    let start: number | undefined;
    if (tParam) {
      const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(tParam);
      if (m) {
        const h = parseInt(m[1] || "0", 10);
        const min = parseInt(m[2] || "0", 10);
        const s = parseInt(m[3] || "0", 10);
        const total = h * 3600 + min * 60 + s;
        if (total > 0) start = total;
      } else if (/^\d+$/.test(tParam)) {
        start = parseInt(tParam, 10);
      }
    }

    return { videoId, start };
  } catch {
    return null;
  }
}

// A rich-text hyperlink becomes an embedded player when its text is the bare
// YouTube URL (or empty). Returns the video to embed, or null for normal links.
export function getEmbeddableYouTube(node: Inline) {
  const uri = node.data.uri as string;
  const linkText = node.content
    .map((c) => ("value" in c && typeof c.value === "string" ? c.value : ""))
    .join("")
    .trim();
  const isBareUrl = linkText === "" || linkText === uri;
  return isBareUrl ? parseYouTubeUrl(uri) : null;
}

// True when a paragraph contains a YouTube embed. The player is a <div>, which
// can't live inside <p>, so such paragraphs must render as <div>.
export function paragraphHasYouTubeEmbed(node: Block | Inline) {
  return node.content.some(
    (c) => c.nodeType === INLINES.HYPERLINK && getEmbeddableYouTube(c as Inline) !== null
  );
}
