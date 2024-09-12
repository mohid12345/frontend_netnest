import React, {useEffect} from "react"
import { useSelector } from "react-redux"
import { Outlet, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom"
import Protect from './routes/protect'
import SideNavBar from './components/sidebar/SideNavBar'
import { useSocket } from './utils/context/SocketContext/SocketContext'
import { toast } from 'sonner'




function App() {
  const selectUser = (state) => state.auth.user
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const socket = useSocket()

  useEffect(() => {
    if(!user){
      navigate("/login")
    }
  }, [user, navigate])

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

  return (
    <>
    <Protect>
      <div className="flex dark:bg-black">
        <SideNavBar/>
        <Outlet/>
      </div>
      </Protect>
    </>
  )
}

export default App
