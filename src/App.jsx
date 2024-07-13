import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login/login'
import HomePage from './pages/userHomePage/HomePage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <HomePage/>
      </div>
    </>
  )
}

export default App
