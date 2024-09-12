// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import logoImg from "../../../public/images/msglogo.jpg"
// import Searchbar from '../searchbar/Searchbar';
// // import Notifications from '../notification/Notifications';
// import Settings from '../settings/Settings';
// import AddPost from '../posts/addPost';
// import Notification from '../notification/Notification';

// function ChatNavbar() {

//   const navigate = useNavigate()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   // add post
//   const [isAddPostOpen, setIsAddPostOpen] = useState(false);
//   const openAddPostModal = () => {
//     setIsAddPostOpen(true);
//     closeSidebar()
//   };
//   const closeAddPostModal = () => {
//     setIsAddPostOpen(false);
//   };

//   // search bar
//   const [isSearchbarOpen, setSearchbarOpen] = useState(false)
//   const openSearchbar = () => {
//     setSearchbarOpen(true);
//     closeSidebar()
//     closeNotification()
//   }
//   const closeSearchbar = () => {
//     setSearchbarOpen(false);
//   }

//   const handleClose = () => {
//     closeSidebar()
//     closeSearchbar()
//     closeNotification()
//   }

//   // notifications
//   const [isNotificationOpen, setNotificationOpen] = useState(false)
//   const openNotification = () => {
//     setNotificationOpen(true)
//     closeSidebar()
//     closeSearchbar()
//   }
//   const closeNotification = () => {
//     setNotificationOpen(false)
//   }

//   // settings
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const openSettingsModal = () => {
//     setIsSettingsOpen(true);
//     handleClose()
//     // closeSidebar()
//   };
//   const closeSettingsModal = () => {
//     setIsSettingsOpen(false);
//   };

//   return (
//     <div className="relative flex flex-col hidden h-full bg-gray-400 border-r border-gray-300 shadow-xl md:block transition-all duration-500 ease-in-out" style={{ width: '4rem', zIndex: 40 }} >
//       <div className="flex justify-between px-3 pt-1 text-gray-300">
        
//         <div className="sm:w-0 md:w-4/12 max-w-64 block justify-end sm:p-0 md:p-2 ">
//           <button
//             type="button"
//             className="inline-flex z-auto items-center p-0 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//             onClick={toggleSidebar}
//           >
//             <span className="sr-only">Toggle sidebar</span>
//             <svg
//               className="w-6 h-6"
//               aria-hidden="true"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 clipRule="evenodd"
//                 fillRule="evenodd"
//                 d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//               ></path>
//             </svg>
//           </button>

//           <aside
//             id="logo-sidebar"
//             className={`pl-0 ml-0 border border-white dark:border-black shadow-md fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
//               isSidebarOpen ? '' : '-translate-x-full sm:translate-x-0'
//             }`}
//             aria-label="Sidebar"
//           >
//             <div className=" h-full px-3 py-4 overflow-y-auto bg-white dark:bg-black">  
//             <div className='flex justify-start ml-2'>
//                 <div className="logo-container  max-w-32 h-auto overflow-hidden flex">
//                   <img className='logo-img transition-transform duration-300 ease-in-out transform hover:scale-110 w-28 flex' src={logoImg} alt="" />
//                 </div>
//                 <div className="flex justify-end p-2 sm:hidden">
//                   <button 
//                     onClick={handleClose}
//                     className="text-white px-2 py-2 rounded"
//                   >
//                     <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//                 <ul className="space-y-0 font-medium mt-2">
//                   <li>
//                     <Link
//                       to={"/" }
//                       onClick={handleClose}
//                       className={`flex items-center p-2 pb-3 text-gray-900 transition duration-75 rounded-lg  dark:hover:bg-gray-700 dark:text-white group`}
//                     >
//                       <svg
//                         className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white`}
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="currentColor"
//                         viewBox="0 0 22 22"
//                       >
//                       <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
//                       </svg>

//                       <span className="ms-3 text-lg text-white dark:text-black">Home</span>
//                     </Link>
//                   </li>
//                   <li>
//                     <div
//                       onClick={openSearchbar}
//                       className="flex items-center cursor-pointer p-2 pb-3 text-gray-900 transition duration-75 rounded-lg   00 dark:hover:bg-gray-700 dark:text-white group"
//                     >
//                       <svg
//                         className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="currentColor"
//                         viewBox="0 0 22 22"
//                       >
//                         <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
//                       </svg>
//                       <span className="ms-3 text-lg text-white dark:text-black">Search</span>
//                     </div>
//                     {isSearchbarOpen && <Searchbar closeSearchmodal={closeSearchbar}/>}
//                   </li>
//                   <li>
//                       <Link
//                         to={'/explore'} 
//                         onClick={handleClose}
//                         className={`flex items-center p-2 pb-3 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group
//                         ${location.pathname === '/explore' 
//                         ? "bg-gray-100 dark:bg-gray-700 "
//                         : "text-gray-800"
//                         }
//                         `}>
//                         <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white
//                         ${location.pathname === '/explore' 
//                         ? "text-gray-900"
//                         : "text-gray-500"
//                         }
//                         `} 
//                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                             <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
//                         </svg>
                        
//                         <span className="flex-1 ms-3 whitespace-nowrap text-lg text-white dark:text-black">Explore</span>
//                       </Link>
//                   </li>
//                   <li>
//                       <Link
//                       to={"/chat" }
//                       onClick={handleClose}
//                       className="flex items-center p-2 pb-3 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group"
//                       >
//                         <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
//                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 22">
//                         <path fill-rule="evenodd" d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z" clip-rule="evenodd"/>
//                         </svg>
//                         <span className="flex-1 ms-3 whitespace-nowrap text-lg text-white dark:text-black">Message</span>
//                         {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
//                         {/* <div tabindex="0" aria-label="heart icon" role="img" class="focus:outline-none w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center">
//                             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M8.00059 3.01934C9.56659 1.61334 11.9866 1.66 13.4953 3.17134C15.0033 4.68334 15.0553 7.09133 13.6526 8.662L7.99926 14.3233L2.34726 8.662C0.944589 7.09133 0.997256 4.67934 2.50459 3.17134C4.01459 1.662 6.42992 1.61134 8.00059 3.01934Z" fill="#EF4444" />
//                             </svg>
//                         </div> */}
//                       </Link>
//                   </li>
                  
//                   <li>
//                       <Link 
//                         to={'/notifications'}
//                         className={`flex items-center p-2 pb-3 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group cursor-pointer
//                           ${location.pathname === '/notifications' 
//                             ? "bg-gray-100 dark:bg-gray-700 "
//                             : "text-gray-800"
//                             }
//                         `}>
//                         <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
//                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M17.133 12.632v-1.8a5.407 5.407 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.933.933 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175Zm-13.267-.8a1 1 0 0 1-1-1 9.424 9.424 0 0 1 2.517-6.391A1.001 1.001 0 1 1 6.854 5.8a7.43 7.43 0 0 0-1.988 5.037 1 1 0 0 1-1 .995Zm16.268 0a1 1 0 0 1-1-1A7.431 7.431 0 0 0 17.146 5.8a1 1 0 0 1 1.471-1.354 9.424 9.424 0 0 1 2.517 6.391 1 1 0 0 1-1 .995ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"/>
//                         </svg>
//                         <span className="flex-1 ms-3 whitespace-nowrap text-lg text-white dark:text-black">Notifications</span>
//                         {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M8.00059 3.01934C9.56659 1.61334 11.9866 1.66 13.4953 3.17134C15.0033 4.68334 15.0553 7.09133 13.6526 8.662L7.99926 14.3233L2.34726 8.662C0.944589 7.09133 0.997256 4.67934 2.50459 3.17134C4.01459 1.662 6.42992 1.61134 8.00059 3.01934Z" fill="#EF4444" />
//                         </svg> */}
//                       </Link>
//                       {/* {isNotificationOpen && <Notification onClose={closeNotification} /> } */}
//                   </li>
//                   <li>
//                     <div
//                       // onClick={openAddPostModal}
//                       className="flex items-center cursor-pointer p-2 pb-3 text-gray-900 transition duration-75 rounded-lg  dark:hover:bg-gray-700 dark:text-white group"
//                     >
//                       <svg
//                         className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="currentColor"
//                         viewBox="0 0 20 22"
//                       >
//                         <path fill-rule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
//                       </svg>
//                       <span className="ms-3 text-lg text-white dark:text-black">Create</span>
//                     </div>
//                   </li>
//                   {isAddPostOpen && {handleClose  } && <AddPost closeAddPost={closeAddPostModal} />}
//                 </ul>
//                 <ul className="pt-4 mt-4 space-y-0 font-medium border-t border-gray-200 dark:border-gray-700">
//                   <li>
//                     <Link
//                       to={"/profile" }
//                       onClick={handleClose}
//                       className={`flex items-center p-2 pb-3 text-gray-900 transition duration-75 rounded-lg  dark:hover:bg-gray-700 dark:text-white group
//                       ${location.pathname === '/profile' 
//                       ? "bg-gray-100 dark:bg-gray-700 "
//                       : "text-gray-800"
//                       }
//                       `}
//                     >
//                       <svg
//                         className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white
//                         ${location.pathname === '/profile' 
//                         ? "text-gray-900"
//                         : "text-gray-500"
//                         }
//                         `}
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="currentColor"
//                         viewBox="0 0 22 22"
//                       >
//                         <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd"/>
//                       </svg>
//                       <span className="ms-3 text-lg text-white dark:text-black">Profile</span>
//                     </Link>
//                   </li>
//                   <li>
//                     <div
//                       // onClick={openSettingsModal}
//                       className="flex items-center p-2 pb-3 text-gray-900 transition duration-75 rounded-lg  dark:hover:bg-gray-700 dark:text-white group cursor-pointer"
//                     >
//                       <svg
//                         className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="currentColor"
//                         viewBox="0 0 22 22"
//                       >
//                         <path fill-rule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clip-rule="evenodd"/>
//                       </svg>
//                       <span className="ms-3 text-lg text-white dark:text-black">Settings</span>
//                     </div>
//                   </li>
//                   { isSettingsOpen && <Settings onClose={closeSettingsModal} /> }
//                   <li>
//                     <Link
//                       to={'/more'}
//                       onClick={handleClose}
//                       className={`flex items-center p-2 pb-3 text-gray-900 transition duration-75 rounded-lg  dark:hover:bg-gray-700 dark:text-white group cursor-pointer
//                       ${location.pathname === '/more' 
//                       ? "bg-gray-100 dark:bg-gray-700 "
//                       : "text-gray-800"
//                       }
//                       `}
//                     >
//                       <svg
//                         className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white
//                         ${location.pathname === '/more' 
//                         ? "text-gray-900"
//                         : "text-gray-500"
//                         }
//                         `}
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="currentColor"
//                         viewBox="0 0 22 22"
//                       >
//                         <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
//                       </svg>
//                       <span className="ms-3 text-lg text-white dark:text-black">More</span>
//                     </Link>
//                   </li>
//                 </ul>
//             </div>
//           </aside>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default ChatNavbar