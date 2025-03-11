import { useState } from 'react'
import "./Square.css"
import { Piece } from "../types"

export default function Square({ row, column, piece }: {row: number, column: number, piece: any}) {  

  return (
    <div className={"square " + ((row + column) % 2 == 1 ? "light-square" : "dark-square")}>
            {piece == undefined ? "" : <div style={{backgroundImage: `url(${piece.imgPath})`}} className="piece"></div>}
            {/* <span className="cords">{row},{column}</span> */}
    </div>
  )
  }
