import React from 'react'
import { formatDistanceToNow } from "date-fns";

function RecievedChat({ message }) {
  return (
    <div className='w-full flex justify-start items-start'>
      <div>
        <div className='flex justify-start relative max-w-xl my-2 mb-2'>
          {(!message?.attachment || message?.attachment.type==='text')  && !message?.sharedPost  && (
            <div className='flex justify-start relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded-t-lg rounded-l-lg shadow'>
              {message?.text}
            </div>
          )}
          {message?.attachment && message?.attachment.type === "image" && (
            <img
              src={message?.attachment.url || message?.attachment.filename}
              alt=""
              className="relative rounded-lg object-cover w-2/4 h-full" 
            />
          )}
          {message?.attachment && message?.attachment.type === "video" && (
            <video
              controls
              className="relative rounded-lg object-cover w-2/4 h-full"
            >
              <source
                src={message?.attachment.url}
              />
            </video>
          )}
          {message?.attachment && message?.attachment.type === "audio" && (
            <VoicePlayer 
              src={message?.attachment.url}
            />
          )}
          {message?.sharedPost && (
            <div className='relative w-2/4 max-w-xl px-4 py-2 text-gray-700 bg-gray-50 rounded-t-lg rounded-r-lg shadow'>
              <div className="flex items-center mb-2">
                <img
                  src={message?.sharedPost?.userId?.profileImg} // Assuming you have the user profile image URL
                  alt="Profile"
                  className="w-10 h-10 rounded-full "
                />
                <div className="ml-2">
                  <p className="font-semibold">{message?.sharedPost?.userId?.userName}</p>
                  {/* <p>{message.sharedPost.userId.name}</p> */}
                </div>
              </div>
              <div>
                <img
                  src={message?.sharedPost?.imgUrl} 
                  alt="Post"
                  className="rounded-lg object-cover w-full h-full mb-1"
                />
                <p className="font-bold text-sm">{message?.sharedPost?.title}</p>
                {/* <p className="mb-0 text-sm">{message?.sharedPost?.description}</p> */}
              </div>
            </div>
          )}
        </div>
        <span className="text-xs flex font-normal text-gray-500 dark:text-gray-400 justify-start px-2">
          {message?.createdAt &&
            formatDistanceToNow(new Date(message?.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

export default RecievedChat