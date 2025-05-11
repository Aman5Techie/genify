import React, { useState, useEffect } from 'react';
import { useVideoContext } from '../context/VideoContext';
import { X, Loader2 } from 'lucide-react';

function PromptModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateVideo, pendingGeneration } = useVideoContext();

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
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">Generate Continuous Video</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your video prompt
              </label>
              <textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to generate..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`
                  px-4 py-2 bg-purple-600 text-white rounded-md transition-colors
                  ${!prompt.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-purple-700'}
                `}
              >
                Generate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PromptModal;