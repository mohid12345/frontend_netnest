import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Person from "./Person";
import { MessageSquarePlus } from "lucide-react";
import MessageUsersModal from "./MessageUsersModal";
import {
  addConversation,
  getChatElibleUsers,
  getUserSearch,
} from "../../services/user/apiMethods1";

function ChatUsers({
  user,
  onlineUsers,
  conversations,
  setConversations,
  setCurrentChat,
  lastMessages,
  currentChat,
}) {
  const [messageUsersModal, setMessageUsersModal] = useState(false);
  const [chatEligibleUsers, setChatEligibleUsers] = useState([]);

  useEffect(() => {
    const userId = user._id;
    getChatElibleUsers({ userId })
      .then((response) => {
        setChatEligibleUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [searchedusers, setSearchedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //search the user
  useEffect(() => {
    if (searchQuery.length >= 2) {
      getUserSearch({ searchQuery: searchQuery })
        .then((response) => {
          setSearchedUsers(response.data.suggestedUsers);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      setSearchedUsers([]);
    }
  }, [searchQuery, setSearchQuery]);

  const searchUser = (event) => {
    setSearchQuery(event.target.value);
  };



  const userId = user._id;
  const handleMessage = (sender) => {
    const senderId = sender._id;
    addConversation({ senderId: userId, receiverId: senderId })
      .then((response) => {
        const userData = response.data;
        const existChat = conversations.filter(
          (conver) => conver._id === userData._id
        );
        if (existChat.length === 0) {
          setConversations((prev) => [...prev, userData]);
          console.log("");
        }
        setCurrentChat(userData);
        setMessageUsersModal(false);
        setSearchedUsers([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };





  return (
    <div
      className={`
      relative flex flex-col  bg-white border-r border-gray-300 shadow-xl transition-all duration-500 ease-in-out
      ${currentChat ? "hidden md:flex" : "flex"}
    `}
      style={{ width: "25rem", zIndex: 40 }}
    >
      <div className="flex justify-between px-3 pt-1 text-white">
        <div className="flex items-center w-full py-2">
          <button
            aria-haspopup="true"
            className="p-2 text-gray-700 rounded-full focus:outline-none hover:text-gray-600 hover:bg-gray-200"
          >
            {/* <svg className="w-6 h-6 text-gray-600 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fillRule="nonzero" d="M4,16 L20,16 C20.5522847,16 21,16.4477153 21,17 C21,17.5128358 20.6139598,17.9355072 20.1166211,17.9932723 L20,18 L4,18 C3.44771525,18 3,17.5522847 3,17 C3,16.4871642 3.38604019,16.0644928 3.88337887,16.0067277 L4,16 L20,16 L4,16 Z M4,11 L20,11 C20.5522847,11 21,11.4477153 21,12 C21,12.5128358 20.6139598,12.9355072 20.1166211,12.9932723 L20,13 L4,13 C3.44771525,13 3,12.5522847 3,12 C3,11.4871642 3.38604019,11.0644928 3.88337887,11.0067277 L4,11 Z M4,6 L20,6 C20.5522847,6 21,6.44771525 21,7 C21,7.51283584 20.6139598,7.93550716 20.1166211,7.99327227 L20,8 L4,8 C3.44771525,8 3,7.55228475 3,7 C3,6.48716416 3.38604019,6.06449284 3.88337887,6.00672773 L4,6 Z"/>
            </svg> */}
            <Link to={"/"}>
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                />
              </svg>
            </Link>
          </button>
          <div className="relative flex items-center w-full pl-2 overflow-hidden text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <button
                type="submit"
                className="p-1 focus:outline-none focus:shadow-none"
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
                    d="M9.5,3 C13.0898509,3 16,5.91014913 16,9.5 C16,10.9337106 15.5358211,12.2590065 14.7495478,13.3338028 L19.7071068,18.2928932 C20.0976311,18.6834175 20.0976311,19.3165825 19.7071068,19.7071068 C19.3466228,20.0675907 18.7793918,20.0953203 18.3871006,19.7902954 L18.2928932,19.7071068 L13.3338028,14.7495478 C12.2590065,15.5358211 10.9337106,16 9.5,16 C5.91014913,16 3,13.0898509 3,9.5 C3,5.91014913 5.91014913,3 9.5,3 Z M9.5,5 C7.01471863,5 5,7.01471863 5,9.5 C5,11.9852814 7.01471863,14 9.5,14 C11.9852814,14 14,11.9852814 14,9.5 C14,7.01471863 11.9852814,5 9.5,5 Z"
                  />
                </svg>
              </button>
            </span>
            <input
              onChange={searchUser}
              type="search"
              name="q"
              className="w-full py-2 pl-12 text-sm text-white bg-gray-200 border border-transparent appearance-none rounded-tg focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue"
              style={{ borderRadius: "25px" }}
              placeholder="Search..."
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      {searchedusers.length === 0 && (
        <div>
          <div className="border-b shadow-b">
            <ul className="flex flex-row items-center inline-block px-2 list-none select-none">
              <li className="flex-auto px-1 mx-1 -mb-px text-center rounded-t-lg cursor-pointer last:mr-0 hover:bg-gray-200">
                <a className="flex items-center justify-center block py-2 text-xs font-semibold leading-normal tracking-wide border-b-2 border-blue-500">
                  All
                </a>
              </li>
              {/* <li className="flex-auto px-1 mx-1 -mb-px text-center rounded-t-lg cursor-pointer last:mr-0 hover:bg-gray-200">
                <a className="flex items-center justify-center block py-2 text-xs font-semibold leading-normal tracking-wide border-b-2 border-transparent">
                  Groups
                </a>
              </li> */}
            </ul>
          </div>
          <div className="relative mt-2 mb-4 overflow-x-hidden overflow-y-auto scrolling-touch lg:max-h-sm scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray">
            <ul className="flex flex-col w-full  px-2 select-none">
              {/* {console.log("conversations",conversations)} */}
              {conversations &&
                conversations.map((conversation) => (
                  <div onClick={() => setCurrentChat(conversation)}>
                    <Person
                      currentUser={user}
                      onlineUsers={onlineUsers}
                      conversation={conversation}
                      lastMessages={lastMessages}
                    />
                    
                  </div>
                ))}
            </ul>
          </div>
        </div>
      )}
      {searchedusers.length > 0 && (
        <div>
          <div className="border-b shadow-b">
            <ul className="flex flex-row items-center inline-block px-2 list-none select-none">
              <li className="flex-auto px-1 mx-1 -mb-px text-center rounded-t-lg cursor-pointer last:mr-0 hover:bg-gray-200">
                <a className="flex items-center justify-center block py-2 text-xs font-semibold leading-normal tracking-wide border-b-2 border-blue-500">
                  Searched Users
                </a>
              </li>
            </ul>
          </div>
          {searchedusers.map((searchuser) => (
            <div key={user.id}>
              {searchuser._id != user._id && (
                <div className="flex items-center justify-between gap-3 mt-4 px-6 hover:bg-slate-100 rounded-md mr-3 py-1">
                  <div className="flex cursor-pointer">
                    <img
                      className="flex w-10  h-10 rounded-full bg-black"
                      src={searchuser.profileImg}
                      alt=""
                    />
                  </div>
                  <div className="flex-1 flex-col w-auto ms-0 mb-0 cursor-pointer">
                    <p className="text-md font-semibold text-black truncate dark:text-white">
                      {searchuser.userName}
                    </p>
                    <p className="text-sm font-normal text-gray-900 truncate dark:text-white">
                      {searchuser.name}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        handleMessage(searchuser);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 lg:w-24 rounded-md"
                    >
                      Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="fixed absolute bottom-0 right-0 z-40 mb-6 mr-4">
        <button
          onClick={() => setMessageUsersModal(true)}
          className="flex items-center justify-center w-12 h-12 mr-3 text-xl font-semibold text-white bg-blue-500 rounded-full focus:outline-none flex-no-shrink"
        >
          <span>
            <MessageSquarePlus />
          </span>
        </button>
      </div>
      {/* to search the users other */}
      {messageUsersModal && (
        <MessageUsersModal
          user={user}
          setMessageUsersModal={setMessageUsersModal}
          chatEligibleUsers={chatEligibleUsers}
          conversations={conversations}
          setConversations={setConversations}
          setCurrentChat={setCurrentChat}
          handleMessage={handleMessage}
        />
      )}
    </div>
  );
}

export default ChatUsers;
