'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';

const URL = 'https://pub-6cdd601131e94ae0949ecdfefa463fcf.r2.dev';
const idx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19];
const videosURL = idx.map((i) => ({ url: `${URL}/${i}.mp4`, name: `Видео ${i}` }));

export default function Home() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const playerRefs = useRef<Array<ReactPlayer | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));

          if (!entry.isIntersecting && playingIndex === index) {
            setPlayingIndex(null);
          }
        });
      },
      { threshold: 0.5 }, // 50% видео должно быть видно, чтобы считаться "на экране"
    );

    document.querySelectorAll('.video-player').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [playingIndex]);

  return (
    <div className="flex flex-col p-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-center">МАТКА</h1>
      </header>
      {videosURL.map((video, index) => (
        <div
          key={index}
          className={`relative w-full p-4 transition-all video-player ${
            playingIndex === index ? 'border-4 border-blue-500' : 'border border-gray-300'
          } rounded-2xl overflow-hidden`}
          data-index={index}
          style={{ aspectRatio: '16/9' }}
        >
          {/* Название видео */}
          <h2 className="absolute top-2 left-4 bg-black text-white text-sm px-3 py-1 rounded-md z-10">{video.name}</h2>

          <ReactPlayer
            ref={(el) => {
              playerRefs.current[index] = el;
            }}
            url={video.url}
            controls
            playing={playingIndex === index}
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: '20px',
              objectFit: 'cover',
            }}
            onPlay={() => {
              if (playingIndex !== null && playingIndex !== index) {
                playerRefs.current[playingIndex]?.getInternalPlayer()?.pause();
              }
              setPlayingIndex(index);
            }}
            onPause={() => playingIndex === index && setPlayingIndex(null)}
          />
        </div>
      ))}
    </div>
  );
}
