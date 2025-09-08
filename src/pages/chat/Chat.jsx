import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChatUsers from "../../components/chatComponent/ChatUsers";
import Messages from "../../components/chatComponent/Messages";
import NoChat from "../../components/chatComponent/NoChat";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { BASE_URL } from "../../constants/baseUrls";
import { addConversation, getLastMessages, getUserConversations, getUserDetails } from "../../services/user/apiMethods1";
import VideoCallModal from "../../components/chatComponent/VideoCallModal";

function Chat() {
    const selectUser = (state) => state.auth.user;
    const user = useSelector(selectUser);
    const location = useLocation()
    const userId = user._id; // Get user ID
    const socket = useRef(null);
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null); // Persons who are speaking (2 people)
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const [joinVideoCall, setJoinVideoCall] = useState(false);
    const [videoCallJoinRoomId, setVideoCallJoinRoomId] = useState("");
    const [isSharePost, setSharePost] = useState(null);
    const [callRequestedUser, setCallRequestedUser] = useState({
        name: "",
        profile: "",
    });

    // Set conversations of two people
    const { shareUser, sharePost } = location.state || {}; // shareUser is the receiver
    
    useEffect(() => {
        if (shareUser) {
            const senderId = shareUser._id;
            addConversation({ senderId: userId, receiverId: senderId })
                .then((response) => {
                    const userData = response.data;
                    const existChat = conversations.find((conver) => conver._id === userData._id);
                    if (!existChat) {
                        setConversations((prev) => [...prev, userData]);
                    }
                    setCurrentChat(userData);
                    setSharePost(sharePost?._id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [shareUser]);

    // Add conversation to DB
    const { MessageThisUser } = location.state || {};
    useEffect(() => {
        if (MessageThisUser) {
            const senderId = MessageThisUser._id;
            addConversation({ senderId: userId, receiverId: senderId }) // Add conversation with two people
                .then((response) => {
                    const userData = response.data;
                    const existChat = conversations.find((conver) => conver._id === userData._id);
                    if (!existChat) {
                        setConversations((prev) => [...prev, userData]);
                    }
                    setCurrentChat(userData);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [MessageThisUser]);

    // Initialize socket connection and get messages
    useEffect(() => {
        if (!socket.current) {
            socket.current = io(BASE_URL);

            socket.current.on("connect", () => {
                console.log("Socket connected");
            });

            socket.current.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            socket.current.on("getMessage", (data) => {
                const senderId = data.senderId;
                console.log("Received message data", data);

                getLastMessages();
                getUserDetails(senderId).then((response) => {
                    console.log("User details response", response.data);
                    setArrivalMessage({
                        sender: response.data.user,
                        text: data.text,
                        attachment: {
                            type: data.messageType,
                            filename: data.file,
                        },
                        createdAt: Date.now(),
                    });
                });
            });
        }

        getUserConversations(userId).then((response) => {
            setConversations(response.data);
        });

        getLastMessages().then((response) => {
            console.log("Last messages response", response.data);
            setLastMessages(response.data);
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    // Handle received message
    useEffect(() => {
        if (
            (arrivalMessage && currentChat?.members.includes(arrivalMessage?.sender)) ||
            currentChat?.members.some((member) => member._id !== arrivalMessage?.sender)
        ) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
        console.log("Updated messages", messages);
        console.log("Latest arrivalMessage", arrivalMessage);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        if (socket.current) {
            socket.current.emit("addUser", user._id);
            socket.current.on("getUsers", (users) => {
                setOnlineUsers(users);
            });
        }
    }, [user]);

    //video call
    useEffect(() => {
        socket.current.on("videoCallResponse", (data) => {
            console.log("videoCallResponse", data);
            setVideoCallJoinRoomId(data.roomId);
            setCallRequestedUser({
                name: data.senderName,
                profile: data.senderProfile,
            });
            setJoinVideoCall(true);
        });
    }, [socket]);

    const handleJoinVidoCallRoom = () => {
        console.log("in video room", `/video-call/${videoCallJoinRoomId}/${userId}`);
        navigate(`/video-call/${videoCallJoinRoomId}/${userId}`);
    };


//remove the duplication caused, by  pagenation/infinity-scroll
    useEffect(() => {
        if (!currentChat || !conversations?.length) return;

        setConversations((prevConversations) => {
            if (prevConversations[0]?._id === currentChat._id) {
                return prevConversations;
            }

            const target = prevConversations.find((chat) => chat._id === currentChat._id);
            if (!target) return prevConversations;

            const updated = [target, ...prevConversations.filter((chat) => chat._id !== currentChat._id)];
            return updated;
        });
    }, [currentChat]);

    const handleDeleteConversation = (id) => {
        setConversations((prev) => prev.filter((c) => c._id !== id));

        // if deleted conversation was currentChat, reset it
        if (currentChat?._id === id) {
            setCurrentChat(null);
        }
    };

    return (
        <div className="relative flex h-screen antialiased bg-gray-200">
            {/* <ChatNavbar /> */}

            <ChatUsers
                user={user}
                onlineUsers={onlineUsers}
                conversations={conversations}
                setConversations={setConversations}
                setCurrentChat={setCurrentChat}
                lastMessages={lastMessages}
                currentChat={currentChat}
                onDeleteConversation={handleDeleteConversation}
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

            {joinVideoCall && (
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
    );
}

export default Chat;
