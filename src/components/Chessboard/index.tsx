import { useState } from 'react'
import Square from "../Square"

import "./Chessboard.css"

let board_tiles = []
for(let i = 8; i > 0; i--) {
    for(let j = 1; j <= 8; j++) {
        board_tiles.push(<Square row={i} column={j} />)
      }
  }


export default function Chessboard () {
    const [positions, setPositions] = useState(Array.from({length: 8}, () => Array.from({length: 8}, () => 0)))

    return (
      <div className="chessboard">
        {board_tiles}
      </div> 
    )
  }
