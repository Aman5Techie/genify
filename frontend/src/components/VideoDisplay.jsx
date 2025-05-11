function VideoDisplay({ videoUrl, onCreateNew }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'genify-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-3xl mx-auto transform transition-all duration-700 animate-fadeIn">
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        Your Generated Video
      </h3>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>
        <div className="relative bg-gray-900 rounded-xl overflow-hidden">
          {/* Set max height and width for the container */}
          <div className="max-h-[400px] max-w-[640px] mx-auto">
            <video 
              src={videoUrl} 
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <button 
          onClick={onCreateNew}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300"
        >
          Create New
        </button>
        <button 
          onClick={handleDownload}
          className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transform hover:scale-105 transition-all duration-300 border border-gray-700"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </span>
        </button>
      </div>
    </div>
  );
}

export default VideoDisplay;