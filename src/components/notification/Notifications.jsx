//updataed socket logic

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNotifications } from '../../services/user/apiMethods';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import FollowRequest from '../follow request/FollowRequest';
// import { useNotificationSocket } from '../../utils/context/SocketContext/nofi_Socket';

function Notifications() {
  const selectedUser = (state) => state.auth.user;
  const user = useSelector(selectedUser);
  const userId = user?._id || "";
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  // const { socket, isConnected } = useNotificationSocket();
  // console.log('use notification socket :::',useNotificationSocket);
  

  // Load initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications({ userId });
        const notificationData = response.data.notifications;
        setNotifications(notificationData);
        console.log('notificatons data ::', notifications);
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // Listen for new notifications
  // useEffect(() => {
  //   if (socket?.current && isConnected) {
  //     socket.current.on('notification', (newNotification) => {
  //       setNotifications(prev => [newNotification, ...prev]);
  //     });

  //     return () => {
  //       socket.current.off('notification');
  //     };
  //   }
  // }, [socket, isConnected]);

  const goProfile = (profileId) => {
    if (profileId === userId) {
      navigate('/profile');
    } else {
      navigate(`/user-profile/${profileId}`);
    }
  };

  return (
    <><div className='mt-10 ml-10'>
      Notifiocan</div> </>
    // <div className='w-full h-screen bg-white'>
    //   <div className='w-full h-screen flex justify-between p-10 gap-10'>
    //     <div className='w-5/12 flex flex-col items-center ml-10 bg-white'>
    //       <div className='flex w-full items-center p-2 mb-2 border-b'>
    //         <p className="font-semibold text-xl dark:text-white">
    //           Notifications {!isConnected && '(Offline)'}
    //         </p>
    //       </div>

    //       {notifications.length > 0 ? (
    //         <div className="flex-grow w-full px-2 overflow-y-auto">
    //           {notifications.map((notification) => (
    //             <div
    //               key={notification._id}
    //               className="w-full py-2 mt-4 bg-gray-50 dark:bg-black rounded shadow flex items-center hover:bg-gray-100 dark:hover:bg-slate-800"
    //             >
    //               <Link
    //                 to={user._id === notification.senderId._id
    //                   ? "/profile"
    //                   : `/user-profile/${notification.senderId._id}`}
    //                 className="focus:outline-none ml-2 w-14 h-12 border rounded-full border-gray-200 dark:border-black flex items-center justify-center cursor-pointer"
    //               >
    //                 <img
    //                   className='w-12 h-12 border rounded-full border-gray-200 flex items-center justify-center'
    //                   src={notification.senderId.profileImg}
    //                   alt={`${notification.senderId.userName}'s profile`}
    //                 />
    //               </Link>
    //               <div className="pl-3 w-full">
    //                 <div className="flex items-center justify-between w-full cursor-pointer text-black dark:text-white">
    //                   <p className="text-sm leading-none">
    //                     <span
    //                       onClick={() => goProfile(notification.senderId._id)}
    //                       className="text-blue-700 font-semibold"
    //                     >
    //                       {notification.senderId.userName}
    //                     </span>
    //                     {' '}{notification.message}
    //                   </p>
    //                 </div>
    //                 <p className="text-xs leading-3 pt-1 text-gray-500">
    //                   {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
    //                 </p>
    //               </div>
    //             </div>
    //           ))}
    //           <div className="flex items-center justify-between mt-8">
    //             <hr className="w-full" />
    //             <p className="text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500">
    //               That's it for now :)
    //             </p>
    //             <hr className="w-full" />
    //           </div>
    //         </div>
    //       ) : (
    //         <div className="flex items-center justify-between mt-8">
    //           <hr className="w-full" />
    //           <p className="text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500">
    //             Empty :(
    //           </p>
    //           <hr className="w-full" />
    //         </div>
    //       )}
    //     </div>

    //     <div className='w-4/12 flex flex-col items-center mr-10 bg-white'>
    //       <div className='flex w-full items-center p-2 mb-2 border-b'>
    //         <p className="font-semibold text-xl dark:text-white">Manage Requests</p>
    //       </div>
    //       <div className='flex-grow w-full px-2 overflow-y-auto'>
    //         <FollowRequest />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Notifications;
