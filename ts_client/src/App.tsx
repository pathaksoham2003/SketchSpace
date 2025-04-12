import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Whiteboard from './pages/Whiteboard/Whiteboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Root from './layout/Root'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Root />}>
            <Route path='/' element={<Home />} />
            <Route path='/board/:id' element={<Whiteboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
