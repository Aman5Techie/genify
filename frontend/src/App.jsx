import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import GlowEffect from './components/GlowEffect';
import VideoGenerator from './components/VideoGenerator';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col relative overflow-hidden">
        <GlowEffect />
        <Header />
        
        <main className="flex-1 flex flex-col items-center justify-center p-4 container mx-auto relative z-10">
          <VideoGenerator />
        </main>
        
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;