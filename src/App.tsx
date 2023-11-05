import { useState } from 'react'
import Chessboard from './components/Chessboard'
import "./App.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="body"> 
        <Chessboard/>
      </div>
    </>
  )
}

export default App
