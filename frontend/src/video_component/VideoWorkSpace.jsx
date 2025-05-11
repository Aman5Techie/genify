import React, { useState } from 'react';
import VideoGrid from './VideoGrid';
import PromptModal from './PromptModal';
import MainVideoDisplay from './MainVideoDisplay';
import { useVideoContext } from '../context/VideoContext';

function VideoWorkspace() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { combineAndDownload } = useVideoContext();


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="w-full max-w-7xl bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      <div className="p-6">
        {/* Main content area with flex layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Video Grid */}
          <div className="lg:w-2/5 order-2 lg:order-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">Video Library</h2>
              <p className="text-gray-400 text-sm">Select videos to add to your sequence</p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 h-[calc(100%-60px)]">
              <VideoGrid onAddVideo={openModal} />
            </div>
          </div>
          
          {/* Right column: Video Player */}
          <div className="lg:w-3/5 order-1 lg:order-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">Video Preview</h2>
              <p className="text-gray-400 text-sm">Watch your combined video sequence</p>
            </div>
            
            <div className="mb-6">
              <MainVideoDisplay />
            </div>
            
            <div className="flex justify-center mt-4">
              <button
                onClick={combineAndDownload}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Download Combined Video
              </button>
            </div>
          </div>
        </div>
      </div>

      <PromptModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default VideoWorkspace;