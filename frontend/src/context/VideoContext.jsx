import React, { createContext, useContext, useState, useEffect } from 'react';
// import { combineVideos, fetchVideoStatus } from '../utils/videoUtils';

const VideoContext = createContext();

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};


const newVideo= {
    id: 'video2',
    url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps_1920x1080_8000k.mp4',
    title: 'Big Buck Bunny 3',
}

export function VideoProvider({ children, initial_videos }) {
  const [videos, setVideos] = useState(initial_videos);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [combinedVideoUrl, setCombinedVideoUrl] = useState(null);
  const [pendingGeneration, setPendingGeneration] = useState(null);

  useEffect(() => {
    // let pollInterval;

    console.log('Pending generation:', pendingGeneration);
    if (!pendingGeneration) return;
    setTimeout(() => {
        setVideos((prev)=>[...prev, newVideo]);
        setPendingGeneration(null);

    }, 5000);

  }, [pendingGeneration]);

  const generateVideo = async (prompt) => {
    const generationId = `gen_${Date.now()}`;
    setPendingGeneration({
      id: generationId,
      prompt
    });
  };

  const reorderVideos = (sourceIndex, destinationIndex) => {
    // Make a copy of the current videos array
    const reorderedVideos = Array.from(videos);
    
    // Remove the item from its original position
    const [movedVideo] = reorderedVideos.splice(sourceIndex, 1);
    
    // Insert the item at its new position
    reorderedVideos.splice(destinationIndex, 0, movedVideo);
    
    // Update the videos array with the new order
    setVideos(reorderedVideos);
    
    // If the selected video was moved, update its index
    if (selectedVideoIndex === sourceIndex) {
      setSelectedVideoIndex(destinationIndex);
    } 
    // If the selected video was affected by the move
    else if (
      (sourceIndex < selectedVideoIndex && destinationIndex >= selectedVideoIndex) ||
      (sourceIndex > selectedVideoIndex && destinationIndex <= selectedVideoIndex)
    ) {
      // Adjust the selected index based on the direction of movement
      const offset = sourceIndex < selectedVideoIndex ? -1 : 1;
      setSelectedVideoIndex(selectedVideoIndex + offset);
    }
  };

  const combineAndDownload = () => {
    if (videos.length < 1) return;
    
    alert('Download combined video functionality not implemented yet.');
  };

  return (
    <VideoContext.Provider value={{
      videos,
      selectedVideoIndex,
      pendingGeneration,
      combinedVideoUrl,
      setSelectedVideoIndex,
      generateVideo,
      reorderVideos,
      combineAndDownload
    }}>
      {children}
    </VideoContext.Provider>
  );
}