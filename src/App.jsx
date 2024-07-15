import React, {useEffect} from "react"
import { useSelector } from "react-redux"
import { Outlet, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom"
import HomePage from './pages/userHomePage/HomePage'
// import Protect from './routes/protect'


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
    {/* <Protect> */}
      <div>
        <HomePage/>
      </div>
      {/* </Protect> */}
    </>
  )
}

export default App
