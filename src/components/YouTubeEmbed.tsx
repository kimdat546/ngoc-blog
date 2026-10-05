'use client';

import { useEffect, useRef, useState } from 'react';
import { MdReplay } from 'react-icons/md';

interface YTPlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    el: HTMLIFrameElement,
    options: { events: { onStateChange: (e: { data: number }) => void } }
  ) => YTPlayer;
  PlayerState: { ENDED: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

// Loads the YouTube IFrame API once and shares it between all embeds on the page.
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT!);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

interface Props {
  videoId: string;
  start?: number;
}

// YouTube no longer lets embeds hide suggested videos at the end (rel=0 only
// limits them to the same channel), so we cover the player with our own
// "watch again" overlay once the video ends.
export default function YouTubeEmbed({ videoId, start }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ended, setEnded] = useState(false);

  const params = new URLSearchParams({ enablejsapi: '1', rel: '0', playsinline: '1' });
  if (start) params.set('start', String(start));
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !iframeRef.current) return;
      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e) => setEnded(e.data === YT.PlayerState.ENDED),
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  const replay = () => {
    setEnded(false);
    playerRef.current?.seekTo(start ?? 0, true);
    playerRef.current?.playVideo();
  };

  return (
    <div className="my-8 w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
        <iframe
          ref={iframeRef}
          src={src}
          title="YouTube video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0"
        />
        {ended && (
          <button
            type="button"
            onClick={replay}
            aria-label="Xem lại video"
            className="absolute inset-0 w-full h-full group cursor-pointer"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />
            <span className="relative inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 text-forest font-medium shadow-lg group-hover:bg-white transition-colors">
              <MdReplay className="text-xl" />
              Xem lại
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
