import { useState } from 'react'
import "./Square.css"

export default function Square({ row, column }) {  

  return (
    <div className={"square " + ((row + column) % 2 == 1 ? "light-square" : "dark-square")}>
    </div>
  )
  }
