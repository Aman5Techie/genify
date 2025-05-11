import React, { createContext, useContext, useState, useEffect } from "react";
import { FINAL_VIDEO, COMBINED_FI, COMBINED_IF, INTIAL_VIDEO} from "../services/asset_list";
const VideoContext = createContext();

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};

export function VideoProvider({ children, initial_videos }) {
  const [videos, setVideos] = useState(initial_videos);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [combinedVideoUrl, setCombinedVideoUrl] = useState(null);
  const [pendingGeneration, setPendingGeneration] = useState(null);

  useEffect(() => {
    // let pollInterval;

    console.log("Pending generation:", pendingGeneration);
    if (!pendingGeneration) return;
    setTimeout(() => {
      const newVideo = {
        id: `video_${Date.now()}`,
        url: FINAL_VIDEO,
        title: `Video ${videos.length + 1}`,
      };
      setVideos((prev) => [...prev, newVideo]);
      setPendingGeneration(null);
    }, 5000);
  }, [pendingGeneration, videos]);

  const generateVideo = async (prompt) => {
    const generationId = `gen_${Date.now()}`;
    setPendingGeneration({
      id: generationId,
      prompt,
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
      (sourceIndex < selectedVideoIndex &&
        destinationIndex >= selectedVideoIndex) ||
      (sourceIndex > selectedVideoIndex &&
        destinationIndex <= selectedVideoIndex)
    ) {
      // Adjust the selected index based on the direction of movement
      const offset = sourceIndex < selectedVideoIndex ? -1 : 1;
      setSelectedVideoIndex(selectedVideoIndex + offset);
    }
  };

  const combineAndDownload = async () => {
  let videoUrl = null;

  if (videos.length===1){
    videoUrl = INTIAL_VIDEO
  }
  else{

    console.log("Combining videos:", videos);
    
    if(videos[0].id === "video_1"){
      videoUrl = COMBINED_IF
    }else{
      videoUrl = COMBINED_FI
    }
  }


  console.log("Combined video URL:", videoUrl);  
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'genify-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
  }
};


  return (
    <VideoContext.Provider
      value={{
        videos,
        selectedVideoIndex,
        pendingGeneration,
        combinedVideoUrl,
        setSelectedVideoIndex,
        generateVideo,
        reorderVideos,
        combineAndDownload,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}
