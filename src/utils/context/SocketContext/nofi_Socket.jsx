import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { BASE_URL } from "../../../constants/baseUrls";
import { toast } from "sonner";

// Create the context with a default value
const NotificationSocketContext = createContext({
  socket: null,
  isConnected: false,
  notificationsLiv: [],
  sendNotification: () => {} // Default empty function
});

export const useNotificationSocket = () => {
  const context = useContext(NotificationSocketContext);
  if (!context) {
    throw new Error('useNotificationSocket must be used within a NotificationSocketProvider');
  }
  return context;
};

export const NotificationSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notificationsLiv, setNotificationsLiv] = useState([]);
  
  console.log('nofi111', notificationsLiv);
  
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    // Connect to the notifications namespace
    socketRef.current = io(`${BASE_URL}/notifications`, {
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to notification socket');
      socketRef.current.emit("addUser", userId);
    });

    socketRef.current.on('notification', (notification) => {
      
      console.log('Received notification:', notification);
      toast.success("new Notification")
      setNotificationsLiv(prev => [notification]);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Notification socket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from notification socket');
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  const sendNotification = (receiverId, type, content) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("sendNotification", {
        senderId: userId,
        receiverId,
        type,
        content
      });
    }
  };

  // Make sure to include all values in the context
  const value = {
    socket: socketRef.current,
    isConnected,
    notificationsLiv,
    sendNotification
  };

  return (
    <NotificationSocketContext.Provider value={value}>
      {children}
    </NotificationSocketContext.Provider>
  );
};