interface Props {
  videoId: string;
  start?: number;
}

export default function YouTubeEmbed({ videoId, start }: Props) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}${
    start ? `?start=${start}` : ""
  }`;

  return (
    <div className="my-8 w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
        <iframe
          src={src}
          title="YouTube video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}

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
