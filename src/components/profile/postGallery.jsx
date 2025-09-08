import React, { useState } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaEye } from "react-icons/fa";

function PostGallery({ post }) {
  const imageUrlArray = post.imgUrl || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imageUrlArray.length) return null;

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrlArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrlArray.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full flex justify-center items-center">
      {/* Image */}
      <img
        src={imageUrlArray[currentIndex]}
        alt={`Post ${currentIndex}`}
        className="w-full max-h-64 object-cover rounded-lg cursor-pointer"
      />
      <div className="absolute flex justify-center items-center bg-slate-400/50 p-4 rounded-xl">
      <FaEye className="size-10"/>
      </div>

      {/* Prev Button */}
      {imageUrlArray.length > 1 && (
        <button
          onClick={prevImage}
          className="absolute left-2 bg-black/50 text-white px-3 py-1 rounded-full"
        >
          <MdNavigateBefore />
        </button>
      )}

      {/* Next Button */}
      {imageUrlArray.length > 1 && (
        <button
          onClick={nextImage}
          className="absolute right-2 bg-black/50 text-white px-3 py-1 rounded-full"
        >
          <MdNavigateNext />
        </button>
      )}
    </div>
  );
}

export default PostGallery;

