//updataed socket logic

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNotifications } from '../../services/user/apiMethods';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import FollowRequest from '../follow request/FollowRequest';
import { useNotificationSocket } from '../../utils/context/SocketContext/nofi_Socket';

function Notifications() {
  const selectedUser = (state) => state.auth.user;
  const user = useSelector(selectedUser);
  const userId = user?._id || "";
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { socket, isConnected } = useNotificationSocket();
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



//working notifiction without socket.(thisi socket implimentation was showing issues realted to emit in socket)

// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { getNotifications } from '../../services/user/apiMethods'
// import { formatDistanceToNow } from 'date-fns'
// import { Link, useNavigate } from 'react-router-dom'
// import FollowRequest from '../follow request/FollowRequest'
// import { io } from 'socket.io-client'
// import { BASE_URL } from '../../constants/baseUrls'


// function Notifications() {

//   const selectedUser = (state) => state.auth.user
//   const user = useSelector(selectedUser)
//   const userId = user._id || ""
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate()
//   const [socket, setSocket] = useState(null)

//   useEffect(() => {
//   //initilize socket.io connection 
//   const newSocket = io(BASE_URL)
//   setSocket(newSocket)

//   //join users room
//   newSocket.emit('join', userId)

//   newSocket.on('newNotification', (notification) => {
//     setNotifications(prevNotifications => [notification, ...prevNotifications])
//   })

//   //clean on conponnet unmount
//   return() =>{
//     newSocket.disconnect()
//   }
// },[userId])


//   useEffect(() => {
//     try {
//       getNotifications({userId})
//         .then((response) => {
//           const notificationData = response.data.notifications
//           // console.log("notificationData", notificationData);
//           setNotifications(notificationData)
//         })
//         .catch((error) => {
//           console.log(error);
//         })
//     } catch (error) {
//       console.log(error);
//     }
//   }, [])

//   const goProfile = (profileId) => {
//     if(profileId === userId) {
//       navigate(`/profile`)
//     } else {
//       navigate(`/user-profile/${profileId}`)
//     }
//   }

//   return (
//     <div className='w-full h-screen bg-white'>
//       <div className='w-full h-screen flex justify-between p-10 gap-10'>
//         <div className='w-5/12 flex flex-col items-center ml-10 bg-white'>
//           {/* notifications */}

//           <div className='flex  w-full items-center p-2 mb-2 border-b'>
//               <p className="font-semibold text-xl dark:text-white">Notifications</p>
//           </div>
        
//           {/* notifications */}
//           {notifications.length > 0 ? (
//             <div className="flex-grow w-full px-2 overflow-y-auto">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification._id} 
//                   className="w-full py-2 mt-4 bg-gray-50 dark:bg-black rounded shadow flex items-center hover:bg-gray-100 dark:hover:bg-slate-800">
//                   <Link 
//                     to={user._id === notification.senderId._id
//                       ? "/profile"
//                       : `/user-profile/${notification.senderId._id}`}
//                     tabIndex="0" 
//                     aria-label="group icon" 
//                     role="img" 
//                     className="focus:outline-none ml-2 w-14 h-12 border rounded-full border-gray-200 dark:border-black flex items-center justify-center cursor-pointer">
//                     <img 
//                       className='focus:outline-none w-12 h-12 border rounded-full border-gray-200 flex items-center justify-center' 
//                       src={notification.senderId.profileImg} 
//                       alt="" 
//                     />
//                   </Link>
//                   <div className="pl-3 w-full">
//                     <div className="flex items-center justify-between w-full cursor-pointer text-black dark:text-white">
//                       <p tabIndex="0" className="focus:outline-none text-sm leading-none">
//                         <span 
//                           onClick={() => goProfile(notification.senderId._id)}
//                           className="text-blue-700">
//                           <span className='font-semibold'>{notification.senderId.userName}</span>
//                         </span> {notification.message}
//                       </p>
//                       <div tabIndex="0" aria-label="close icon" role="button" className="focus:outline-none cursor-pointer">
//                         {/* <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path d="M10.5 3.5L3.5 10.5" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
//                           <path d="M3.5 3.5L10.5 10.5" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg> */}
//                       </div>
//                     </div>
//                     <p tabIndex="0" className="focus:outline-none text-xs leading-3 pt-1 text-gray-500">
//                       {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
//                     </p>
//                   </div>  
//                 </div>
//               ))}
//               <div className="flex items-center justify-between mt-8">
//                 <hr className="w-full"/>
//                 <p tabIndex="0" className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500">That's it for now :)</p>
//                 <hr className="w-full"/>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-between mt-8">
//               <hr className="w-full"/>
//               <p tabIndex="0" className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500">Empty :(</p>
//               <hr className="w-full"/>
//             </div>
//           )}
//         </div>

//         <div className='w-4/12 flex flex-col items-center mr-10 bg-white'>
//           {/* manage requestt */}

//           <div className='flex w-full items-center p-2 mb-2 border-b'>
//               <p className="font-semibold text-xl dark:text-white">Manage Requests</p>
//           </div>

//           <div className='flex-grow w-full px-2 overflow-y-auto'>
//             <FollowRequest />
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Notifications