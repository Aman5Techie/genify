function Loader({ size = "default" }) {
    const sizeClasses = {
      small: "h-5 w-5",
      default: "h-10 w-10",
      large: "h-16 w-16",
    };
    
    return (
      <div className="flex justify-center items-center">
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-white ${sizeClasses[size]}`}></div>
      </div>
    );
  }
  
  export default Loader;