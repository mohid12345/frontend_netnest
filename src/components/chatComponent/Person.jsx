import React, { useEffect, useState } from "react";
import { deleteConverstion } from "../../services/user/apiMethods";

function Person({ conversation, currentUser, lastMessages, onlineUsers }) {
  const [user, setUser] = useState(null);
  const conversationId = conversation._id;
  const [isOnline, setIsOnline] = useState(false);
  const userId = currentUser._id;
  const [lastMessageText, setLastMessageText] = useState("");

  const handleDeleteConv = (id) => {
    try {
      deleteConverstion(id)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Conversation deleted successfully");
          }
        })
        .catch((error) => {
          console.error("Error occurred:", error);
          });
      } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  
  useEffect(() => {
    if (conversation) {
      const person = conversation.members.find(
        (m) => m._id !== currentUser._id
      );
      setUser(person);
      // console.log("last messages", lastMessages);
      const lastMessage = lastMessages.find(
        (message) => message.conversationId === conversation?._id
      );
      if (lastMessage) {
        setLastMessageText(lastMessage.text);
      }
      setIsOnline(() => {
        if (onlineUsers.find((user) => user.userId === person._id)) {
          return true;
        } else {
          return false;
        }
      });
    }
  }, [conversation, currentUser, onlineUsers]);

  return (
    <div>
      <li
        className="flex flex-no-wrap items-center pr-3 text-black rounded-lg cursor-pointer mt-200 py-65 hover:bg-gray-200"
        style={{ paddingTop: "0.65rem", paddingBottom: "0.65rem" }}
      >
        <div className="flex justify-between w-full focus:outline-none">
          <div className="flex justify-between w-full">
            <div className="relative flex items-center justify-center w-12 h-12 ml-2 mr-3 text-xl font-semibold text-white bg-blue-500 rounded-full flex-no-shrink">
              <img
                className="object-cover w-12 h-12 rounded-full"
                src={user?.profileImg}
                alt=""
              />
              {isOnline && (
                <div
                  className="absolute bottom-0 right-0 flex items-center justify-center bg-white rounded-full"
                  style={{ width: "0.80rem", height: "0.80rem" }}
                >
                  <div
                    className="bg-green-500 rounded-full"
                    style={{ width: "0.6rem", height: "0.6rem" }}
                  ></div>
                </div>
              )}
            </div>
            <div className="items-center flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <h2 className="text-sm font-semibold text-black">
                  {user?.userName}
                </h2>
                <div className="flex">
                  <svg
                    className="w-4 h-4 text-green-500 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="14"
                    viewBox="0 0 19 14"
                  >
                    <path
                      fillRule="nonzero"
                      d="M4.96833846,10.0490996 L11.5108251,2.571972 C11.7472185,2.30180819 12.1578642,2.27443181 12.428028,2.51082515 C12.6711754,2.72357915 12.717665,3.07747757 12.5522007,3.34307913 L12.4891749,3.428028 L5.48917485,11.428028 C5.2663359,11.6827011 4.89144111,11.7199091 4.62486888,11.5309823 L4.54038059,11.4596194 L1.54038059,8.45961941 C1.2865398,8.20577862 1.2865398,7.79422138 1.54038059,7.54038059 C1.7688373,7.31192388 2.12504434,7.28907821 2.37905111,7.47184358 L2.45961941,7.54038059 L4.96833846,10.0490996 L11.5108251,2.571972 L4.96833846,10.0490996 Z M9.96833846,10.0490996 L16.5108251,2.571972 C16.7472185,2.30180819 17.1578642,2.27443181 17.428028,2.51082515 C17.6711754,2.72357915 17.717665,3.07747757 17.5522007,3.34307913 L17.4891749,3.428028 L10.4891749,11.428028 C10.2663359,11.6827011 9.89144111,11.7199091 9.62486888,11.5309823 L9.54038059,11.4596194 L8.54038059,10.4596194 C8.2865398,10.2057786 8.2865398,9.79422138 8.54038059,9.54038059 C8.7688373,9.31192388 9.12504434,9.28907821 9.37905111,9.47184358 L9.45961941,9.54038059 L9.96833846,10.0490996 L16.5108251,2.571972 L9.96833846,10.0490996 Z"
                    />
                  </svg>
                  <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="14"
                    viewBox="0 0 19 14"
                    style={{ color: "transparent" }}
                  >
                    <path
                      fillRule="nonzero"
                      d="M7.96833846,10.0490996 L14.5108251,2.571972 C14.7472185,2.30180819 15.1578642,2.27443181 15.428028,2.51082515 C15.6711754,2.72357915 15.717665,3.07747757 15.5522007,3.34307913 L15.4891749,3.428028 L8.48917485,11.428028 C8.2663359,11.6827011 7.89144111,11.7199091 7.62486888,11.5309823 L7.54038059,11.4596194 L4.54038059,8.45961941 C4.2865398,8.20577862 4.2865398,7.79422138 4.54038059,7.54038059 C4.7688373,7.31192388 5.12504434,7.28907821 5.37905111,7.47184358 L5.45961941,7.54038059 L7.96833846,10.0490996 L14.5108251,2.571972 L7.96833846,10.0490996 Z"
                    />
                  </svg>
                  <span className="ml-1 text-xs font-medium text-gray-600">
                    12.52
                  </span>
                  <div onClick={()=> handleDeleteConv(conversation._id)} className="pl-3 group relative" >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    <div className="absolute right-0 top-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm leading-none truncate">
                <span>{lastMessageText}</span>
                {/* <span className="flex items-center justify-center w-5 h-5 text-xs text-right text-white bg-green-500 rounded-full">2</span> */}
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
}

export default Person;
