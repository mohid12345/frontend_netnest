import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications } from "../../services/user/apiMethods";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useNotificationSocket } from "../../utils/context/SocketContext/nofi_Socket";

function Notification({ onClose }) {
    const selectedUser = (state) => state.auth.user;
    const user = useSelector(selectedUser);
    const userId = user._id || "";
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { notificationsLiv } = useNotificationSocket(); // Access notifications from context

    console.log("11111", notificationsLiv);
    useEffect(() => {
        try {
            getNotifications({ userId })
                .then((response) => {
                    const notificationData = response.data.notifications;
                    console.log("notificationData", notificationData);
                    setNotifications(notificationData);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const goProfile = (profileId) => {
        if (profileId === userId) {
            navigate(`/profile`);
            onClose();
        } else {
            navigate(`/user-profile/${profileId}`);
            onClose();
        }
    };

    //Merging live notificaion from notf_websocket
    useEffect(() => {
      setNotifications(prevNotifications => {
          const notificationsMap = new Map();
  
          // Add new notifications first (so they appear on top)
          notificationsLiv.forEach(notif => notificationsMap.set(notif._id, notif));
  
          // Then add previous notifications (only if they are not duplicates)
          prevNotifications.forEach(notif => {
              if (!notificationsMap.has(notif._id)) {
                  notificationsMap.set(notif._id, notif);
              }
          });
  
          // Convert Map back to an array
          return Array.from(notificationsMap.values());
      });
  }, [notificationsLiv]);
  
  

    return (
        <div className="fixed w-screen h-screen top-0 left-64 z-50 bg-black bg-opacity-30 backdrop-blur-md ml-0 border-l-1">
            <div className="fixed w-full max-w-sm px-2 h-screen top-0 flex flex-col bg-white dark:bg-black">
                <div className="flex justify-between p-2 border-b">
                    <div className="flex-grow flex items-center ml-0">
                        <p className="font-semibold text-xl dark:text-white">Notifications</p>
                    </div>
                    <div className="flex justify-end p-2">
                        <button onClick={() => navigate("/")} className="text-white px-2 py-2 rounded">
                            <svg
                                className="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex border-t border-gray-400">{/* optional divider */}</div>

                {/* notifications */}
                {notifications.length > 0 ? (
                    <div className="flex-grow overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="w-full py-2 mt-6 bg-white dark:bg-black rounded shadow flex items-center hover:bg-gray-100 dark:hover:bg-slate-800"
                            >
                                <div
                                    onClick={() => goProfile(notification.senderId._id)}
                                    tabIndex="0"
                                    aria-label="group icon"
                                    role="img"
                                    className="focus:outline-none w-12 h-10 border rounded-full border-gray-200 dark:border-black flex items-center justify-center cursor-pointer"
                                >
                                    <img
                                        className="focus:outline-none w-10 h-10 border rounded-full border-gray-200 flex items-center justify-center"
                                        src={notification?.senderId?.profileImg}
                                        alt=""
                                    />
                                </div>
                                <div className="pl-3 w-full">
                                    <div className="flex items-center justify-between w-full cursor-pointer text-black dark:text-white">
                                        <p tabIndex="0" className="focus:outline-none text-sm leading-none">
                                            <span
                                                onClick={() => goProfile(notification.senderId._id)}
                                                className="text-blue-700"
                                            >
                                                {notification?.senderId?.userName}
                                            </span>{" "}
                                            {notification.message}
                                        </p>
                                        <div
                                            tabIndex="0"
                                            aria-label="close icon"
                                            role="button"
                                            className="focus:outline-none cursor-pointer"
                                        ></div>
                                    </div>
                                    <p tabIndex="0" className="focus:outline-none text-xs leading-3 pt-1 text-gray-500">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between mt-8">
                            <hr className="w-full" />
                            <p
                                tabIndex="0"
                                className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500"
                            >
                                That's it for now :)
                            </p>
                            <hr className="w-full" />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between mt-8">
                        <hr className="w-full" />
                        <p
                            tabIndex="0"
                            className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500"
                        >
                            Empty :(
                        </p>
                        <hr className="w-full" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notification;
