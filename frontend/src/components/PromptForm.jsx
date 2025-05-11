import { useState, useEffect, useRef } from 'react';
import {INTIAL_PROMPT} from '../services/asset_list'
import Loader from './Loader';

function PromptForm({ onSubmit, isLoading, jobId }) {
  const [prompt, setPrompt] = useState(INTIAL_PROMPT);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

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

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Set new height based on scrollHeight, up to the max height
      const newHeight = Math.min(textareaRef.current.scrollHeight, 300); // 300px max height
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setIsTyping(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
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
              ref={textareaRef}
              value={prompt}
              onChange={handlePromptChange}
              className={`w-full bg-gray-800 backdrop-blur-md bg-opacity-80 rounded-lg p-5 pr-14 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] max-h-[300px] overflow-y-auto transition-all ${isTyping ? 'border-blue-500' : 'border-transparent'} border-2`}
              placeholder="Describe your video idea in detail..."
              disabled={true}
              style={{ height: '120px' }}
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
      
      {isLoading && jobId && (
        <div className="mt-8 flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-blue-400">Processing your video... This may take a few minutes</p>
        </div>
      )}
    </div>
  );
}

export default PromptForm;