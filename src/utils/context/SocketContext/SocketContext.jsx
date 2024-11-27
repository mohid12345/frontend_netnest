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
  // console.log("user id at sockets :::", user);
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
