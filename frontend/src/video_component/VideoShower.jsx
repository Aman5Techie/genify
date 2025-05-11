import React from "react";
import { VideoProvider } from "../context/VideoContext";
import VideoWorkspace from "./VideoWorkSpace";

// format
// videoUrl = {
//   id: 'video1',
//   url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//   title: 'Big Buck Bunny',
// }


const VideoShower = ({videoUrl}) => {
  
  return (
    <VideoProvider initial_videos={[videoUrl]} >
        <VideoWorkspace/>
    </VideoProvider>
  );
};

export default VideoShower;
