import React, {useEffect} from "react"
import { useSelector } from "react-redux"
import { Outlet, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom"
import Protect from './routes/protect'
import SideNavBar from './components/sidebar/SideNavBar'


function App() {
  const selectUser = (state) => state.auth.user
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    if(!user){
      navigate("/login")
    }
  }, [user, navigate])
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
