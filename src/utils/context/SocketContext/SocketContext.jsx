import { createContext, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { BASE_URL } from "../../../constants/baseUrls";

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const socket = useRef(null)
  const selectedUser = (state) => state.auth.user
  const user = useSelector(selectedUser)
  const userId = user?._id || ""
  useEffect(() => {
    socket.current = io(BASE_URL)
    if(user) {
      console.log("in context");
      socket.current.emit("addUser", userId)
    }

    return () => {
      if(socket.current) {
        socket.current.disconnect()
      }
    }
  }, [])
  return ( <SocketContext.Provider value={socket} > {children} </SocketContext.Provider> )
} 



// export default SocketContext