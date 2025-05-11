import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useVideoContext } from '../context/VideoContext';

function MainVideoDisplay() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Get context values
  const { videos, selectedVideoIndex, setSelectedVideoIndex } = useVideoContext();
  

  // Use the selectedVideoIndex from context instead of managing it internally
  const [localVideoIndex, setLocalVideoIndex] = useState(selectedVideoIndex);
  
  // Sync local index with context index when it changes
  useEffect(() => {
    if (selectedVideoIndex !== localVideoIndex) {
      setLocalVideoIndex(selectedVideoIndex);
      setCurrentTime(0);
      
      // Wait for the video element to update with the new source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.error('Auto-play error:', err));
        }
      }, 0);
    }
  }, [selectedVideoIndex]);

  useEffect(() => {
    if (videoRef.current) {
      const onTimeUpdate = () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
      };
      
      const onLoadedMetadata = () => {
        setDuration(videoRef.current?.duration || 0);
      };
      
      videoRef.current.addEventListener('timeupdate', onTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      videoRef.current.addEventListener('ended', handleVideoEnded);

      return () => {
        videoRef.current?.removeEventListener('timeupdate', onTimeUpdate);
        videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
        videoRef.current?.removeEventListener('ended', handleVideoEnded);
      };
    }
  }, [localVideoIndex, videos]);

  const handleVideoEnded = () => {
    // Move to next video if available
    if (localVideoIndex < videos.length - 1) {
      const nextIndex = localVideoIndex + 1;
      setLocalVideoIndex(nextIndex);
      setSelectedVideoIndex(nextIndex); // Update the context too
      
      // Automatically play the next video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.error('Auto-play error:', err));
        }
      }, 0);
    } else {
      // If it's the last video, reset to the first one or stop
      setLocalVideoIndex(0);
      setSelectedVideoIndex(0); // Update the context too
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.error('Play error:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipToPrevVideo = () => {
    if (localVideoIndex > 0) {
      const prevIndex = localVideoIndex - 1;
      setLocalVideoIndex(prevIndex);
      setSelectedVideoIndex(prevIndex); // Update the context too
      
      setCurrentTime(0);
      // Maintain play state when changing videos
      setTimeout(() => {
        if (isPlaying && videoRef.current) {
          videoRef.current.play().catch(err => console.error('Play error:', err));
        }
      }, 0);
    } else {
      // If it's the first video, just restart it
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  const skipToNextVideo = () => {
    if (localVideoIndex < videos.length - 1) {
      const nextIndex = localVideoIndex + 1;
      setLocalVideoIndex(nextIndex);
      setSelectedVideoIndex(nextIndex); // Update the context too
      
      setCurrentTime(0);
      // Maintain play state when changing videos
      setTimeout(() => {
        if (isPlaying && videoRef.current) {
          videoRef.current.play().catch(err => console.error('Play error:', err));
        }
      }, 0);
    } else {
      // If it's the last video, go back to the first one
      setLocalVideoIndex(0);
      setSelectedVideoIndex(0); // Update the context too
      setCurrentTime(0);
      // Maintain play state when changing videos
      setTimeout(() => {
        if (isPlaying && videoRef.current) {
          videoRef.current.play().catch(err => console.error('Play error:', err));
        }
      }, 0);
    }
  };

  return (
   <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700 aspect-video max-h-[400px] mx-auto">
      {videos && videos.length > 0 ? (
        <div>
          <video 
            ref={videoRef}
            className="w-full aspect-video object-contain"
            loop={false} // Don't loop videos, let our custom handler manage it
            src={videos[localVideoIndex]?.url}
            muted
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="text-white text-sm mb-1 px-2">
              Now Playing: {videos[localVideoIndex]?.title || `Video ${localVideoIndex + 1} of ${videos.length}`}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={skipToPrevVideo}
                className="text-white hover:text-purple-400 transition-colors"
              >
                <SkipBack size={24} />
              </button>
              
              <div className="flex-1 flex items-center gap-2">
                <span className="text-white text-sm">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime || 0}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white text-sm">{formatTime(duration)}</span>
              </div>
              
              <button
                onClick={skipToNextVideo}
                className="text-white hover:text-purple-400 transition-colors"
              >
                <SkipForward size={24} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center text-gray-500 text-lg font-medium">
          Add videos to begin
        </div>
      )}
    </div>
  );
}

export default MainVideoDisplay;