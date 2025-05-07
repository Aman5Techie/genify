import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import GlowEffect from './components/GlowEffect';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Handle typing animation for placeholder
  useEffect(() => {
    let typingTimeout;
    if (isTyping) {
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
    return () => clearTimeout(typingTimeout);
  }, [isTyping]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setIsTyping(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Set video URL after 5 seconds
    setTimeout(() => {
      setVideoUrl('https://res.cloudinary.com/dvq5cfzcw/video/upload/v1746533804/tdyr37x4f8c5prza32ia.mp4');
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col relative overflow-hidden">
      <GlowEffect />
      
      <header className="p-4 border-b border-gray-800 backdrop-blur-sm bg-opacity-30 bg-black z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Genify
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 container mx-auto relative z-10">
        {!videoUrl ? (
          <div className="w-full max-w-3xl transition-all duration-500 transform hover:scale-[1.01]">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Generate video from text
              </h2>
              <p className="text-gray-400 text-xl">
                Transform your ideas into stunning videos with AI
              </p>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-gradient"></div>
              
              <form onSubmit={handleSubmit} className="relative bg-gray-900 rounded-xl p-2">
                <div className="relative overflow-hidden">
                  <textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    className={`w-full bg-gray-800 backdrop-blur-md bg-opacity-80 rounded-lg p-5 pr-14 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] transition-all ${isTyping ? 'border-blue-500' : 'border-transparent'} border-2`}
                    placeholder="Describe your video idea in detail..."
                    disabled={isLoading}
                  />
                  
                  <button 
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute bottom-4 right-4 rounded-full p-3 disabled:opacity-50 transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 z-10"
                  >
                    {!isLoading ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    ) : (
                      <Loader size="small" />
                    )}
                  </button>
                  
                  {isTyping && (
                    <div className="absolute bottom-3 left-5 flex space-x-2 items-center text-xs text-gray-400">
                      <span className="animate-pulse">AI assistant is listening</span>
                      <span className="flex">
                        <span className="animate-bounce delay-75">.</span>
                        <span className="animate-bounce delay-150">.</span>
                        <span className="animate-bounce delay-300">.</span>
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Example prompts: "A futuristic city at sunset" • "Aerial view of mountains" • "Underwater coral reef exploration"</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl transform transition-all duration-700 animate-fadeIn">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Your Generated Video
            </h3>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                <video 
                  src={videoUrl} 
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button 
                onClick={() => {
                  setVideoUrl('');
                  setPrompt('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300"
              >
                Create New
              </button>
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transform hover:scale-105 transition-all duration-300 border border-gray-700">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </span>
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="p-6 border-t border-gray-800 backdrop-blur-sm bg-opacity-30 bg-black z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">© 2025 Genify by Aman5TechieChanges</div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;