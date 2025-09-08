import { useState, useEffect } from "react";

function VideoPlayer({ src, className }) {
  const [loading, setLoading] = useState(true);

  // Reset loader when src changes
  useEffect(() => {
    setLoading(true);
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 z-10">
          <span className="loader">Loading video...</span>
        </div>
      )}

      <video
        // key={src} 
        controls
        preload="metadata"
        className={`rounded-lg w-full h-full transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoadedData={() => setLoading(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
