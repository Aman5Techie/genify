function Footer() {
    return (
      <footer className="p-6 border-t border-gray-800 backdrop-blur-sm bg-opacity-30 bg-black z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">© 2025 Genify by Aman5Techie</div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;