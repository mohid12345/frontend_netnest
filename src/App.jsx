import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Protect from "./routes/protect";
import SideNavBar from "./components/sidebar/SideNavBar";
import { useSocket } from "./utils/context/SocketContext/SocketContext";
// import { useNotificationSocket } from "./utils/context/SocketContext/nofi_Socket";
import { toast } from "sonner";

function App() {
  const selectUser = (state) => state.auth.user;
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log("socket data :::", socket);
    
    if (!socket || !socket.current) return;

    const handleNotification = (data) => {
      console.log("New notification received:", data);
      toast(
        <div className="flex gap-2">
          <img
            src={data.postImage[0]}
            alt="User"
            className="h-8 rounded-full"
          />
          <p className="text-sm">
            {data.senderName} {data.message}
          </p>
        </div>
      );
    };

    socket.current.on('getNotifications', handleNotification);

    return () => {
      if (socket.current) {
        socket.current.off('getNotifications', handleNotification);
      }
    };
  }, [socket]);

  return (
    <>
      <Protect>
        <div className="flex dark:bg-black">
          <SideNavBar />
          <Outlet />
        </div>
      </Protect>
    </>
  );
}

export default App;

// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   Outlet,
//   useNavigate,
// } from "react-router-dom";
// import Protect from "./routes/protect";
// import SideNavBar from "./components/sidebar/SideNavBar";
// import { useSocket } from "./utils/context/SocketContext/SocketContext";
// import { toast } from "sonner";

// function App() {
//   const selectUser = (state) => state.auth.user;
//   const user = useSelector(selectUser);
//   const navigate = useNavigate();
//   const socket = useSocket();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     if (!socket.current) return;

//     socket.current.on('getNotifications', (data) => {
//       console.log("New notification received:", data);
//       toast(
//         <div className="flex gap-2">
//           <img
//             src={data.postImage[0]}
//             alt="User"
//             className="h-8 rounded-full"
//           />
//           <p className="text-sm">
//             {data.senderName} {data.message}
//           </p>
//         </div>
//       );
//     });

//     return () => {
//       if (socket.current) {
//         socket.current.off('getNotifications');
//       }
//     };
//   }, [socket]);

//   return (
//     <>
//       <Protect>
//         <div className="flex dark:bg-black">
//           <SideNavBar />
//           <Outlet />
//         </div>
//       </Protect>
//     </>
//   );
// }

// export default App;

// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   Outlet,
//   Route,
//   BrowserRouter as Router,
//   Routes,
//   useNavigate,
// } from "react-router-dom";
// import Protect from "./routes/protect";
// import SideNavBar from "./components/sidebar/SideNavBar";
// import { useSocket } from "./utils/context/SocketContext/SocketContext";
// import { toast } from "sonner";

// function App() {
//   const selectUser = (state) => state.auth.user;
//   const user = useSelector(selectUser);
//   const navigate = useNavigate();
//   const socket = useSocket();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

  // useEffect(() => {
  //   socket.on("getNotifications", ({ postImage, senderName, message }) => {
  //     // Handle the incoming notification
  //     // You might want to update your app's state or display a notification to the user
  //     console.log("New notification (result):", { postImage, senderName, message });
  //     // Add your notification handling logic here
  //   });

  //   return () => {
  //     socket.off("getNotifications");
  //   };
  // }, []);

  // useEffect(() => {
  //   if(!socket.current) return
  //   socket.current.on('getNotifications', (data) => {
  //     toast(
  //       <div className="flex gap-2">
  //         <img
  //           src={data.postImage[0]}
  //           alt="User"
  //           className="h-8 rounded-full"
  //         />
  //         <p className="text-sm">
  //           {data.senderName} {data.message}
  //         </p>
  //       </div>
  //     )
  //   })
  // }, [socket])

//   return (
//     <>
//       <Protect>
//         <div className="flex dark:bg-black">
//           <SideNavBar />
//           <Outlet />
//         </div>
//       </Protect>
//     </>
//   );
// }

// export default App;
