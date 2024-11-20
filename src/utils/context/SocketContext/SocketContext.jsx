import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { BASE_URL } from "../../../constants/baseUrls";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const selectedUser = (state) => state.auth.user;
  const user = useSelector(selectedUser);
  console.log("user id at sockets :::", user);
  const userId = user?._id || "";

  useEffect(() => {
    socket.current = io(BASE_URL);
    
    socket.current.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
      if (user) {
        console.log("Emitting addUser");
        socket.current.emit("addUser", userId);
      }
    });

    socket.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user, userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// import { createContext, useContext, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import io from "socket.io-client";
// import { BASE_URL } from "../../../constants/baseUrls";

// const SocketContext = createContext();

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const socket = useRef(null);
//   const selectedUser = (state) => state.auth.user;
//   const user = useSelector(selectedUser);
//   const userId = user?._id || "";

//   useEffect(() => {
//     socket.current = io(BASE_URL);
//     if (user) {
//       console.log("in context");
//       socket.current.emit("addUser", userId);
//     }
//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//     };
//   }, [user, userId]);

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// import { createContext, useContext, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import io from "socket.io-client";
// import { BASE_URL } from "../../../constants/baseUrls";

// const SocketContext = createContext();

// export const useSocket = () => useContext(SocketContext); //custom hook

// export const SocketProvider = ({ children }) => {
//   const socket = useRef(null); //initilized using useRef to keep websoc connection persist across rerenders
//   const selectedUser = (state) => state.auth.user;
//   const user = useSelector(selectedUser);
//   const userId = user?._id || "";
//   //socket connection setup
//   useEffect(() => {
//     socket.current = io(BASE_URL);
//     if (user) {
//       console.log("in context");
//       socket.current.emit("addUser", userId); //if user is present addUser is emited to server
//     }

//     return () => {
//       // this is cleanup function
//       if (socket.current) {
//         socket.current.disconnect();
//       }
//     };
//   }, []);
//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// export default SocketContext
