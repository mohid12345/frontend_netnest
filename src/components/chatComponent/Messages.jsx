import React, { useEffect, useRef, useState } from 'react'
import { addMessage, getUserMessages } from '../../services/user/apiMethods';
import { toast } from 'sonner';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import SendedChat from './SendedChat';
import RecievedChat from './RecievedChat';
import VoiceRecorder from './VoiceRecorder';
import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Messages({ 
  user, 
  currentChat, 
  messages, 
  setMessages, 
  socket, 
  shareUser, 
  isSharePost, 
  setSharePost, 
  onlineUsers, 
  setCurrentChat })
{

  const [isOnline, setIsOnline] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [friend, setFriend] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef();
  const navigate = useNavigate()

  useEffect(() => {
    const friend = currentChat?.members.find((m) => m._id !== user._id);
    setFriend(friend);
    const currentChatId = currentChat?._id;
    setIsOnline(() => {
      if(onlineUsers.find((user) => user.userId === friend._id)) {
        return true 
      } else {
        return false
      }
    })
    getUserMessages(currentChatId)
    .then((response) => {
      setMessages(response.data)
      console.log("user messages", response.data);
      })
  }, [currentChat, onlineUsers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function randomID(len) {
    let result = "";
    if (result) return result;
    const chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJL",
      maxPos = chars.length;
    len = len || 5;
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

  const handleVideoCall = () => {
    const roomId = randomID(10)
    const receiverId = friend?._id
    const emitData = {
      senderId: user._id,
      senderName: user.userName,
      senderProfile: user.profileImg,
      receiverId,
      roomId: roomId,
    };
    socket.current.emit("videoCallRequest", emitData);
    navigate(`/video-call/${roomId}/${user._id}`);
  }

  const handleSubmit = (file) => {
    const formData = new FormData();
    const currentChatId = currentChat._id;
    const userId = user._id;
    const receiver = currentChat.members.find((member) => member !== user._id);
    let messageType = "";
  
    if (isSharePost) {
      console.log("share post id", isSharePost);
      messageType = "sharePost";
      formData.append("sharedPost", isSharePost); // Convert to string before appending
      formData.append("text", "post shared"); // Append "post shared" to the text field
    } else if (file) {
      if (file.type.startsWith("image/")) {
        messageType = "image";
      } else if (file.type.startsWith("video/")) {
        messageType = "video";
        console.log(file);
      } else if (file.type.startsWith("audio/")) {
        messageType = "audio";
        console.log(file);
      }
      formData.append("file", file);
      // setNewMessage(messageType);
    } else {
      messageType = "text";
      formData.append("text", newMessage); // Append the text message
    }
  
    formData.append("conversationId", currentChatId);
    formData.append("sender", userId);
    formData.append("messageType", messageType);
  
    const receiverId = receiver ? receiver._id : null;
    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId,
      text: isSharePost ? "post shared" : newMessage, // Emit "post shared" or the actual text
      messageType,
      file: file?.name,
      sharedPost: isSharePost ? JSON.stringify(isSharePost) : null,
    });
  
    addMessage(formData)
      .then((response) => {
        console.log("response after adding", response.data);
        toast.info("message has been sent");
        setNewMessage("");
        setMessages([...messages, response.data]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
      if(isSharePost) {
        navigate('/')
        setSharePost(null);
      }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      handleSubmit();
    }
  };

  const handleImageClick = () => {
    const fileInput = document.getElementById("image")
    if(fileInput) {
      fileInput.click()
    }
  }

  const handleVideoClick = () => {
    const fileInput = document.getElementById("video")
    if(fileInput) {
      fileInput.click()
    }
  }

  const addAudioFile = async (blob) => {
    setIsRecording(false)
    const url = URL.createObjectURL(blob)
    const audio = document.createElement("audio")
    audio.src = url
    audio.controls = true
    document.body.appendChild(audio);

    const audioFile = new File([blob], `${Date.now()}%2Baudio.mp3`, {
      type: "audio/mpeg",
    });
    handleSubmit(audioFile)
  }

  const cancelSharePost = () => {
    setSharePost(null)
    navigate('/')
  }

  return (
    <div className="relative flex flex-col flex-1">
      <div className="z-20 flex flex-grow-0 flex-shrink-0 w-full pr-3 bg-white border-b">
        <div className="w-12 h-12 mx-4 my-2 bg-blue-500 bg-center bg-no-repeat bg-cover rounded-full cursor-pointer">
          {friend && (
            <img
              className="rounded-full object-cover w-full h-full"
              src={friend?.profileImg}
              alt=""
            />
          )}
        </div>
        <div className="flex flex-col justify-center flex-1 overflow-hidden cursor-pointer">
          <div className="overflow-hidden text-base font-medium leading-tight text-gray-600 whitespace-no-wrap">
            {friend ? friend.userName : 'Loading...'}
          </div>
          <div className="overflow-hidden text-sm font-medium leading-tight text-gray-600 whitespace-no-wrap">
            {isOnline ? (
              <span>Online</span>
            ): (
              <span>Offline</span>
            )}
          </div>
        </div>
        <button 
          onClick={handleVideoCall}
          className="flex self-center p-2 ml-2 text-gray-500 rounded-full focus:outline-none hover:text-gray-600 hover:bg-gray-300">
          <svg
            className="w-6 h-6 text-gray-600 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <Video/>
          </svg>
        </button>
        <button
        onClick={() => setCurrentChat(null)} 
        className="flex self-center p-2 ml-2 text-gray-500 rounded-full focus:outline-none hover:text-gray-600 hover:bg-gray-300">
          <svg
            className="w-6 h-6 text-gray-600 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
          </svg>
        </button>
        <button
          type="button"
          className="flex self-center hidden p-2 ml-2 text-gray-500 rounded-full md:block focus:outline-none hover:text-gray-600 hover:bg-gray-300"
        >
          <svg
            className="w-6 h-6 text-gray-600 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="nonzero"
              d="M12,16 C13.1045695,16 14,16.8954305 14,18 C14,19.1045695 13.1045695,20 12,20 C10.8954305,20 10,19.1045695 10,18 C10,16.8954305 10.8954305,16 12,16 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z M12,4 C13.1045695,4 14,4.8954305 14,6 C14,7.1045695 13.1045695,8 12,8 C10.8954305,8 10,7.1045695 10,6 C10,4.8954305 10.8954305,4 12,4 Z"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col flex-1 pt-4 overflow-hidden bg-gray-200 rounded-t-xl" ref={scrollRef}>
        <div className="relative flex flex-col flex-1 px-4 overflow-x-hidden overflow-y-auto bg-gray-200 scrollbar">
          <div className="flex justify-center w-full py-2">
            <button className="flex self-center text-xs text-gray-500 focus:outline-none hover:underline">
              See all messages
            </button>
          </div>
          <div className="self-center px-2 py-1 mx-0 my-1 text-xs text-gray-700 bg-white border border-gray-200 rounded-full shadow rounded-tg">
            {currentChat?.createdAt &&
              new Date(currentChat.createdAt).toLocaleDateString()}
          </div>
          <div className="flex flex-col">
            {/* Render message list */}
            
            {messages.length !== 0 && messages.map((message, index) => {
              return message?.sender?._id === user._id || 
              message?.sender === user._id ? (
                <div key={index} 
                  className='self-end w-3/4 my-2'>
                    <SendedChat message={message} />
                </div>
              ) : (
                <div key={index}
                  className='self-start w-3/4 my-2'>
                    <RecievedChat message={message} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-full py-2 bg-gray-200 mb-4 flex justify-center text-gray-600 focus-within:text-gray-400">
        <div className="relative flex flex-row items-center h-10 w-8/12">
          {!isRecording && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 focus:outline-none focus:shadow-none text-gray-600"
            >
              <svg
                className="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.495.93A.5.5 0 0 0 6.5 13c0 1.19.644 2.438 1.618 3.375C9.099 17.319 10.469 18 12 18c1.531 0 2.9-.681 3.882-1.625.974-.937 1.618-2.184 1.618-3.375a.5.5 0 0 0-.995-.07.764.764 0 0 1-.156.096c-.214.106-.554.208-1.006.295-.896.173-2.111.262-3.343.262-1.232 0-2.447-.09-3.343-.262-.452-.087-.792-.19-1.005-.295a.762.762 0 0 1-.157-.096ZM8.99 8a1 1 0 0 0 0 2H9a1 1 0 1 0 0-2h-.01Zm6 0a1 1 0 1 0 0 2H15a1 1 0 1 0 0-2h-.01Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
          )}

          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {newMessage.trim().length > 0 ? (
              <button
                type="submit"
                onClick={handleSubmit}
                className="p-1 focus:outline-none focus:shadow-none text-gray-700 hover:text-blue-500"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="nonzero"
                    d="M6.43800037,12.0002892 L6.13580063,11.9537056 C5.24777712,11.8168182 4.5354688,11.1477159 4.34335422,10.2699825 L2.98281085,4.05392998 C2.89811796,3.66698496 2.94471512,3.2628533 3.11524595,2.90533607 C3.53909521,2.01673772 4.60304421,1.63998415 5.49164255,2.06383341 L22.9496381,10.3910586 C23.3182476,10.5668802 23.6153089,10.8639388 23.7911339,11.2325467 C24.2149912,12.1211412 23.8382472,13.1850936 22.9496527,13.6089509 L5.49168111,21.9363579 C5.13415437,22.1068972 4.73000953,22.1534955 4.34305349,22.0687957 C3.38131558,21.8582835 2.77232686,20.907987 2.9828391,19.946249 L4.34336621,13.7305987 C4.53547362,12.8529444 5.24768451,12.1838819 6.1356181,12.0469283 L6.43800037,12.0002892 Z M5.03153725,4.06023585 L6.29710294,9.84235424 C6.31247211,9.91257291 6.36945677,9.96610109 6.44049865,9.97705209 L11.8982869,10.8183616 C12.5509191,10.9189638 12.9984278,11.5295809 12.8978255,12.182213 C12.818361,12.6977198 12.4138909,13.1022256 11.8983911,13.1817356 L6.44049037,14.0235549 C6.36945568,14.0345112 6.31247881,14.0880362 6.29711022,14.1582485 L5.03153725,19.9399547 L21.6772443,12.0000105 L5.03153725,4.06023585 Z"
                  />
                </svg>
              </button>
            ) : (
              <div className='flex'>
                <input
                  type="file"
                  name="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      setImage(file);
                      console.log(image);
                      handleSubmit(file);
                    }
                  }}
                  hidden
                />
                <input
                  type="file"
                  name="file"
                  id="video"
                  accept="video/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      setVideo(file);
                      console.log(video);
                      handleSubmit(file);
                    }
                  }}
                  hidden  
                />
                  {/* voice */}
                  {/* <button type="submit" className="p-1 focus:outline-none focus:shadow-none hover:text-blue-500"> */}
                

                  {/* <button onClick={() => setIsRecording(!isRecording)} className="p-1 text-gray-600 hover:text-blue-500">
                    <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M5 8a1 1 0 0 1 1 1v3a4.006 4.006 0 0 0 4 4h4a4.006 4.006 0 0 0 4-4V9a1 1 0 1 1 2 0v3.001A6.006 6.006 0 0 1 14.001 18H13v2h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2H9.999A6.006 6.006 0 0 1 4 12.001V9a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
                    <path d="M7 6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V6Z"/>
                    </svg>
                  </button> */}

                  
                {/* image */}
                {!isRecording && (
                  <>
                    <button onClick={handleImageClick} type="submit" className="p-1 text-gray-600 hover:text-blue-500">
                      <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                      <path fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clip-rule="evenodd"/>
                      </svg>
                    </button>

                    <button onClick={handleVideoClick} type="submit" className="p-1 text-gray-600 hover:text-blue-500">
                      <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-2 4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H9Zm0 2h2v2H9v-2Zm7.965-.557a1 1 0 0 0-1.692-.72l-1.268 1.218a1 1 0 0 0-.308.721v.733a1 1 0 0 0 .37.776l1.267 1.032a1 1 0 0 0 1.631-.776v-2.984Z" clip-rule="evenodd"/>
                      </svg>
                    </button>
                  </>
                )}
                <span onClick={() => setIsRecording(!isRecording)} className='ml-1'>
                  <VoiceRecorder 
                    onRecordingComplete={addAudioFile}
                    setRecordedAudioBlob={setRecordedAudioBlob}
                    style={{ background: "none " ,  borderRadius: 0 }}
                  />
                </span>
              </div>
            )}
          </div>

          {isRecording ? (
            <span className='w-full py-3 pl-10 text-md bg-white border border-transparent appearance-none rounded-full placeholder-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue'>
              Recording...
            </span>
          ): (
            <input
            className="w-full py-3 pl-10 text-md bg-white border border-transparent appearance-none rounded-tg placeholder-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue"
            style={{ borderRadius: "25px" }}
            type="text"
            placeholder="Message..."
            autoComplete="off"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          )}

          {showEmojiPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "50px", 
                left: "0",
                zIndex: "10",
              }}
            >
              <Picker
                data={data}
                onEmojiSelect={(emoji) => {
                  setNewMessage((prevMessage) => prevMessage + emoji.native);
                }}
              />
            </div>
          )}

          {isSharePost && (
            <div
            // style={{
            //   position: "absolute",
            //   bottom: "70px", 
            //   left: "0",
            //   zIndex: "10",
            // }} 
            style={{
              position: "absolute",
              bottom: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: "10",
            }}
            >
              <div className='flex gap-4'>
                <button
                  onClick={handleSubmit}
                  class="w-28 h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
                >
                  Send
                </button>
                <button
                  onClick={cancelSharePost}
                  class="flex justify-center items-center gap-2 w-28 h-12 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#fb7185] via-[#e11d48] to-[#be123c] hover:shadow-xl hover:shadow-red-500 hover:scale-105 duration-300 hover:from-[#be123c] hover:to-[#fb7185]"
                >
                  <svg viewBox="0 0 15 15" class="w-5 fill-white">
                    <svg
                      class="w-6 h-6"
                      stroke="currentColor"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                    Button
                  </svg>
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages