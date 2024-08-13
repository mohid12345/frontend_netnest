import React, { useState } from 'react'
import ShowPost from '../../components/homepost/ShowPost';

function ExploreGallery({ post, fetchposts }) {

  const [showPostModal, setShowPostModal] = useState(false)
  const handleModal = () => {
    setShowPostModal(!showPostModal)
  }

  const imageUrlArray = post.imgUrl;
  return (
    <div className="flex flex-wrap gap-4 w-full lg:pr-0 ">
      {imageUrlArray.map((imageUrl, index) => (
        <div  
          onClick={handleModal}
          key={index}
          className="relative overflow-hidden w-full transition-transform duration-300 cursor-pointer"
        >
          <img
            className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-125"
            src={imageUrl}
            alt={`Post ${index}`}
          />
        </div>
      ))}

      {showPostModal && (
        <ShowPost post={post} fetchposts={fetchposts} onClose={handleModal} />
      )}
    </div>
  );
}

export default ExploreGallery