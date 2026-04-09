'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import YouTube, { YouTubeEvent } from 'react-youtube';

export default function VideoScroll({ youtubeVideoId }: { youtubeVideoId: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isOpened = document.body.style.overflow !== 'hidden';
    
    const onOpen = () => {
      isOpened = true;
    };
    window.addEventListener('invitation-opened', onOpen);

    let onceListenerAdded = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!isOpened && document.body.style.overflow === 'hidden') {
            if (!onceListenerAdded) {
               window.addEventListener('invitation-opened', () => {
                 setIsVisible(true);
               }, { once: true });
               onceListenerAdded = true;
            }
          } else {
            setIsVisible(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
       observer.disconnect();
       window.removeEventListener('invitation-opened', onOpen);
    };
  }, []);

  const onPlay = (event: YouTubeEvent) => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.pause();
    }
  };

  const onPause = (event: YouTubeEvent) => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio && audio.paused) {
       audio.play().catch(err => console.log('Audio resume prevented:', err));
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden glass shadow-xl aspect-video relative"
    >
      {!isVisible ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      ) : (
        <YouTube
          videoId={youtubeVideoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              rel: 0,
              controls: 1,
            },
          }}
          className="w-full h-full border-0 absolute inset-0"
          iframeClassName="w-full h-full border-0 absolute inset-0"
          onPlay={onPlay}
          onPause={onPause}
          onEnd={onPause}
        />
      )}
    </motion.div>
  );
}
