import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import VoicePlayer from "./VoicePlayer ";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteOneMsg } from "../../services/user/apiMethods";
import { toast } from "sonner";


function SendedChat({ message }) {
  const selectUser = (state) => state.auth.user;
  const user = useSelector(selectUser);
  // console.log("message", message);

  // const [message, setMessage] = useState('')
  // useEffect(() => {
  //   if(message){
  //    setMessage(message)
  //   }
  // }, [])

  const deleteOne = (id) => {
    try {
      deleteOneMsg(id)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Message deleted successfully");
          }
        })
        .catch((error) => {
          console.error("Error deleting message:", error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="w-full flex justify-end items-start">
      <div>
        <div className="flex justify-end max-w-xl my-2 mb-2">
          {!message.attachment && !message.sharedPost && (
            <div className="flex justify-center gap-x-4 group">
              <div className="flex justify-end relative max-w-xl px-4 py-2 text-gray-700 bg-blue-100 rounded-t-lg rounded-r-lg shadow">
                {message.text}
              </div>
              <div
                onClick={() => deleteOne(message._id)}
                className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out mt-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
            </div>
          )}
          {message.attachment && message.attachment.type === "image" && (
            <img
              key={message.attachment.url}
              src={message.attachment.url}
              alt=""
              className="relative rounded-lg object-cover w-2/4 h-full"
            />
          )}
          {message.attachment && message.attachment.type === "video" && (
            <video
              controls
              className="relative rounded-lg object-cover w-2/4 h-full"
            >
              <source src={message.attachment.url} />
            </video>
          )}
          {message.attachment && message.attachment.type === "audio" && (
            <VoicePlayer src={message.attachment.url} />
          )}
          {message.sharedPost && (
            <div className="relative w-2/4 max-w-xl px-4 py-2 text-gray-700 bg-gray-50 rounded-t-lg rounded-r-lg shadow">
              <Link
                to={
                  user._id === message?.sharedPost?.userId._id
                    ? "/profile"
                    : `/user-profile/${message?.sharedPost?.userId._id}`
                }
                className="flex items-center mb-2"
              >
                <img
                  src={message?.sharedPost?.userId?.profileImg} // Assuming you have the user profile image URL
                  alt="Profile"
                  className="w-10 h-10 rounded-full "
                />
                <div className="ml-2">
                  <p className="font-semibold">
                    {message?.sharedPost?.userId?.userName}
                  </p>
                  {/* <p>{message.sharedPost.userId.name}</p> */}
                </div>
              </Link>
              <div>
                <img
                  src={message?.sharedPost?.imgUrl}
                  alt="Post"
                  className="rounded-lg object-cover w-full h-full mb-1"
                />
                <p className="font-bold text-sm">
                  {message?.sharedPost?.title}
                </p>
                {/* <p className="mb-0 text-sm">{message?.sharedPost?.description}</p> */}
              </div>
            </div>
          )}
        </div>
        <span className="text-xs flex font-normal text-gray-500 dark:text-gray-400 justify-end px-2">
          {message?.createdAt &&
            formatDistanceToNow(new Date(message?.createdAt), {
              addSuffix: true,
            })}
        </span>
      </div>
    </div>
  );
}

export default SendedChat;
