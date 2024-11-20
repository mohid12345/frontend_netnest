import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { BASE_URL } from "../../../constants/baseUrls";

const NotificationSocketContext = createContext();

export const useNotificationSocket = () => useContext(NotificationSocketContext);

export const NotificationSocketProvider = ({ children }) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const selectedUser = (state) => state.auth.user;
  const user = useSelector(selectedUser);
  console.log("user id at nofi_sockets :::", user);
  
  const userId = user?._id || "";

  useEffect(() => {
    socket.current = io(`${BASE_URL}/notifications`); // You might use a namespace like /notifications if the backend supports it

    socket.current.on('connect', () => {
      setIsConnected(true);
      console.log('Notification socket connected');
      if (user) {
        console.log("Emitting notification addUser");
        socket.current.emit("addUser", userId);
      }
    });

    socket.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Notification socket disconnected');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user, userId]);

  return (
    <NotificationSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
