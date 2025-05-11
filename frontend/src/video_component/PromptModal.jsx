import React, { useState, useEffect, useRef } from 'react';
import { useVideoContext } from '../context/VideoContext';
import { X, Loader2 } from 'lucide-react';

function PromptModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateVideo, pendingGeneration } = useVideoContext();
  const textareaRef = useRef(null);

  // Monitor pending generation and close modal when complete
  console.log('Pendingxox generation:', pendingGeneration);
  
  useEffect(() => {
    if (isGenerating && pendingGeneration === null) {
      // Video generation completed
      setIsGenerating(false);
      setPrompt("");
      onClose(); // Close the modal
    }
  }, [pendingGeneration, isGenerating, onClose]);

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
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      await generateVideo(prompt);
      // Don't reset prompt or isGenerating here
      // The useEffect will handle it when pendingGeneration becomes null
    } catch (error) {
      console.error('Error generating video:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {isGenerating ? (
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-white text-lg">Generating your video...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          
          {/* Add cancel button to allow user to stop waiting */}
          <button 
            onClick={() => {
              setIsGenerating(false);
              onClose();
            }}
            className="mt-6 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div 
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h3 className="text-2xl font-semibold text-white">Generate Continuous Video</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-3">
                Enter your video prompt
              </label>
              <textarea
                id="prompt"
                ref={textareaRef}
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Describe the video you want to generate..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px] max-h-[300px] overflow-y-auto resize-none"
                required
                style={{ height: '260px' }}
              />
              <p className="text-sm text-gray-400 mt-2">
                Be detailed in your description for better results.
              </p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`
                  px-6 py-3 bg-purple-600 text-white rounded-md transition-colors font-medium
                  ${!prompt.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-purple-700'}
                `}
              >
                Generate Video
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PromptModal;