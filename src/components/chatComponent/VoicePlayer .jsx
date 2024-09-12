import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const VoicePlayer = ({ src }) => {
  const waveSurferRef = useRef(null);
  const waveContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveContainerRef.current,
      waveColor: '#ddd',
      progressColor: '#4a90e2',
      cursorColor: '#4a90e2',
      height: 60,
      barWidth: 2,
      barHeight: 1,
      responsive: true,
    });

    waveSurferRef.current = waveSurfer;

    waveSurfer.load(src);

    waveSurfer.on('ready', () => {
      setDuration(waveSurfer.getDuration());
    });

    waveSurfer.on('audioprocess', () => {
      setCurrentTime(waveSurfer.getCurrentTime());
    });

    waveSurfer.on('finish', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      waveSurfer.destroy();
    };
  }, [src]);

  const handlePlayPause = () => {
    if (isPlaying) {
      waveSurferRef.current.pause();
    } else {
      waveSurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div ref={waveContainerRef} className="w-full"></div>
      <div className="flex items-center mt-2">
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded focus:outline-none"
          onClick={handlePlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span className="text-sm text-gray-700">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default VoicePlayer;
