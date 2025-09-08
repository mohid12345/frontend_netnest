import { useState } from "react";
import { Spinner } from "flowbite-react";

function ImageWithLoader({ src, alt, className }) {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        className={`relative cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/70">
            <Spinner color="info" aria-label="Loading" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`rounded-lg object-cover w-full h-full transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* Fullscreen overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsOpen(false)} // close when background clicked
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking image itself
          />
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

export default ImageWithLoader;
