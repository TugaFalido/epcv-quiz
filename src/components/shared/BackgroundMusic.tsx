'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch((e) => {
        setIsMuted(true);
      });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        autoPlay
        loop
        src="/sounds/bg-sound.mp3" // Replace with your audio file path
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/20"
      >
        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </Button>
    </div>
  );
}; 