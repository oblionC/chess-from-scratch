import { useState } from 'react'
import "./Square.css"

export default function Square({ row, column, piece }) {  

  return (
    <div className={"square " + ((row + column) % 2 == 1 ? "light-square" : "dark-square")}>
            {piece == undefined ? "" : <img src={piece.imgPath} className="piece"></img>}
    </div>
  )
  }
