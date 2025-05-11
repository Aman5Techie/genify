function Header() {
  return (
    <header className="p-4 border-b border-gray-800 backdrop-blur-sm bg-opacity-30 bg-black z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
          Genify
        </h1>
        
        {/* Demo notice in the center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm font-medium px-3 py-1 bg-blue-600 text-white rounded-md shadow-md">
            <span className="inline-block mr-1">🔍</span>
            Demo Website - Pre-configured Experience
          </p>
      
          <p className="text-xs italic text-amber-400 mt-1">
            💸 Sorry folks, my wallet couldn't handle those Claude API bills 💸
          </p>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
            <li><a href="https://github.com/Aman5Techie/genify" className="hover:text-blue-400 transition-colors">Github</a></li>
            <li><a href="https://www.linkedin.com/in/amanverma9585/" className="hover:text-blue-400 transition-colors">ME</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;