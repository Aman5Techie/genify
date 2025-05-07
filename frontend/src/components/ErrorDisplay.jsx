function ErrorDisplay({ error, onReset }) {
    return (
      <div className="w-full max-w-4xl transform transition-all duration-700 animate-fadeIn">
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-3xl font-bold mb-4 text-red-500">Issue Occurred</h3>
          <p className="text-xl mb-6">{error}</p>
          <button 
            onClick={onReset}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  export default ErrorDisplay;