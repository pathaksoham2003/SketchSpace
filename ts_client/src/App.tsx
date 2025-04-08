import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Whiteboard from './component/Whiteboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Whiteboard/>
    </>
  )
}

export default App
