import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ChatUsers from '../../components/chatComponent/ChatUsers'
import Messages from '../../components/chatComponent/Messages'
import NoChat from '../../components/chatComponent/NoChat'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { BASE_URL } from '../../constants/baseUrls' 
import { addConversation, getLastMessages, getUserConversations, getUserDetails } from '../../services/user/apiMethods1'
import VideoCallModal from '../../components/chatComponent/VideoCallModal'
// import ChatNavbar from '../../components/chatComponent/ChatNavbar'

function Chat() {

  const selectUser = (state) => state.auth.user
  const user  = useSelector(selectUser)
  const userId = user._id //get user id
  const socket = useRef()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);//persons who are sepeaking( 2pple)
  console.log("current chat persons",currentChat); //will show sender and receiver or the current two personnels
  const [messages, setMessages] = useState([])
  const [lastMessages, setLastMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isGroup, setIsGroup] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [joinVideoCall, setJoinVideoCall] = useState(false);
  const [videoCallJoinRoomId, setVideoCallJoinRoomId] = useState("");
  const [isSharePost, setSharePost] = useState(null)
  const [callRequestedUser, setCallRequestedUser] = useState({
    name: "",
    profile: "",
  });

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const messageUserId = queryParams.get("userId");
  // console.log("messageUserId in chat", messageUserId);


  //set convestions of two people
  const { shareUser, sharePost } = location.state || {}; //sharuser is the receiver guy
  useEffect(() => {
    if(shareUser) {
      const userId = user._id
      const senderId = shareUser._id
      addConversation({senderId: userId, receiverId: senderId})
      .then((response) => {
        const userData = response.data;
        const existChat = conversations.filter((conver) => conver._id === userData._id)
        if(existChat.length === 0) {
          setConversations((prev) => [...prev, userData])
          console.log("");
        }
        setCurrentChat(userData)//statae
        setSharePost(sharePost._id)//for sharing post//state
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },[shareUser])


  //add conversation to db
  const { MessageThisUser } = location.state || {};
  useEffect(() => {
    if(MessageThisUser) {
      const userId = user._id
      const senderId = MessageThisUser._id
      addConversation({senderId: userId, receiverId: senderId})//addConversation with two pple
      .then((response) => {
        const userData = response.data;
        const existChat = conversations.filter((conver) => conver._id === userData._id)
        if(existChat.length === 0) {
          setConversations((prev) => [...prev, userData])
          console.log("");
        }
        setCurrentChat(userData)
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [MessageThisUser])



  //getmessage    
  useEffect(() => {

    socket.current = io(BASE_URL)

    getUserConversations(userId) 
      .then((response) => {
        setConversations(response.data)
      })

    getLastMessages()
      .then((response) => {
        console.log("res for last msg", response.data);
        setLastMessages(response.data)
      })
//listen to server to receive an message//and its not in message. its passed as props
    socket.current.on("getMessage", (data) => {
      const senderId = data.senderId
      console.log("get messag data", data);
      getLastMessages()
      getUserDetails(senderId)
        .then((response) => {
          console.log("res from userdetails", response.data);
          setArrivalMessage({
            sender: response.data.user,
            text: data.text,
            attachment: {
              type: data.messageType,
              filename: data.file,
            },
            createdAt: Date.now(),
          })
          console.log("arrivalMessage is",arrivalMessage);
        })
    })
  }, [])



//handling received message
  useEffect(() => {
    ( arrivalMessage && currentChat?.members.includes(arrivalMessage?.sender)) || 
    (currentChat?.members.find(
      (member) => member._id !== arrivalMessage?.sender
    ) && 
      setMessages((prev) => [...prev, arrivalMessage])
    )
    console.log("messages in useffect", messages)
    console.log("arrivalMessage in useffect", arrivalMessage)
  },[arrivalMessage, currentChat])

  useEffect(() => {
    socket?.current?.emit("addUser", user._id)
    socket?.current?.on("getUsers", (users) => {
      setOnlineUsers(users)
    })
  },[user])




//video call
  useEffect(() => {
    socket.current.on("videoCallResponse", (data) => {
      console.log("videoCallResponse",data);
      setVideoCallJoinRoomId(data.roomId);
      setCallRequestedUser({
        name: data.senderName,
        profile: data.senderProfile,
      });
      setJoinVideoCall(true);
    });
  },[socket])

  const handleJoinVidoCallRoom = () => {
    console.log("in video room", `/video-call/${videoCallJoinRoomId}/${userId}`);
    navigate(`/video-call/${videoCallJoinRoomId}/${userId}`);
  };






  
  return (
    <div className="relative flex w-full h-screen overflow-hidden antialiased bg-gray-200">

      {/* <ChatNavbar /> */}

      <ChatUsers 
        user={user}
        onlineUsers={onlineUsers}
        conversations={conversations}
        setConversations={setConversations}
        setCurrentChat={setCurrentChat}
        lastMessages={lastMessages}
        currentChat={currentChat}
      />

      {currentChat && (
        <Messages 
          messages={messages}
          setMessages={setMessages} //passes the arrival message
          user={user}
          onlineUsers={onlineUsers}
          setCurrentChat={setCurrentChat}
          currentChat={currentChat}
          socket={socket}
          shareUser={shareUser}
          MessageThisUser={MessageThisUser}
          isSharePost={isSharePost}
          setSharePost={setSharePost}
        />
      )}

{!currentChat && (
  <div className="hidden md:flex relative z-0 flex-col flex-1 bg-gray-300 justify-center items-center h-screen">
    <NoChat />
  </div>
)}

      {joinVideoCall &&  (
        <VideoCallModal 
        show={joinVideoCall}
        onHide={() => setJoinVideoCall(false)}
        onAccept={handleJoinVidoCallRoom}
        onReject={() => {
          setVideoCallJoinRoomId("");
          setJoinVideoCall(false);
        }}
        caller={callRequestedUser}
        />
      )}

    </div>
  )
}

export default Chat