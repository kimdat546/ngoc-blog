'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  type?: string;
  poster?: string;
  caption?: string;
}

export default function ScrollAutoplayVideo({ src, type, poster, caption }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTapToUnmute, setNeedsTapToUnmute] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      video.muted = false;
      try {
        await video.play();
        setNeedsTapToUnmute(false);
      } catch {
        video.muted = true;
        setNeedsTapToUnmute(true);
        try {
          await video.play();
        } catch {
          // ignore
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
    setNeedsTapToUnmute(false);
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <div className="relative w-full max-w-3xl">
        <video
          ref={videoRef}
          className="rounded-lg w-full"
          playsInline
          loop
          controls
          poster={poster}
          preload="metadata"
        >
          <source src={src} type={type} />
        </video>
        {needsTapToUnmute && (
          <button
            type="button"
            onClick={handleUnmute}
            className="absolute bottom-4 right-4 bg-forest/80 hover:bg-forest text-white text-sm px-3 py-2 rounded-full shadow-lg backdrop-blur-sm"
          >
            🔊 Bật âm thanh
          </button>
        )}
      </div>
      {caption && (
        <p className="text-sm text-sage text-center mt-2 italic">{caption}</p>
      )}
    </div>
  );
}
