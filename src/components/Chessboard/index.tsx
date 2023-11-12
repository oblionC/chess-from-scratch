import { useState } from 'react'
import Square from "../Square"
import "./Chessboard.css"

class Piece{
  constructor(public imgPath: string, public x: number, public y: number)  {
    this.imgPath = imgPath;
    this.x = x;
    this.y = y;
  }
}

let pieces = []
// Black pawns
for(let i = 0; i < 8; i++) {
  let piece = new Piece("assets/images/pawn_b.png", i, 6);
  pieces.push(piece);
}
// White pawns
for(let i = 0; i < 8; i++) {
  let piece = new Piece("assets/images/pawn_w.png", i, 1);
  pieces.push(piece);
}
// Rooks
pieces.push(new Piece("assets/images/rook_b.png", 0, 7));
pieces.push(new Piece("assets/images/rook_b.png", 7, 7));
pieces.push(new Piece("assets/images/rook_w.png", 0, 0));
pieces.push(new Piece("assets/images/rook_w.png", 7, 0));

// Knights
pieces.push(new Piece("assets/images/knight_b.png", 1, 7));
pieces.push(new Piece("assets/images/knight_b.png", 6, 7));
pieces.push(new Piece("assets/images/knight_w.png", 1, 0));
pieces.push(new Piece("assets/images/knight_w.png", 6, 0));

// Rooks
pieces.push(new Piece("assets/images/bishop_b.png", 2, 7));
pieces.push(new Piece("assets/images/bishop_b.png", 5, 7));
pieces.push(new Piece("assets/images/bishop_w.png", 2, 0));
pieces.push(new Piece("assets/images/bishop_w.png", 5, 0));

// Kings
pieces.push(new Piece("assets/images/king_b.png", 4, 7));
pieces.push(new Piece("assets/images/king_w.png", 4, 0));

// Queen
pieces.push(new Piece("assets/images/queen_b.png", 3, 7));
pieces.push(new Piece("assets/images/queen_w.png", 3, 0));

let board_tiles = []
for(let i = 7; i >= 0; i--) {
  for(let j = 0; j <= 7; j++) {
    board_tiles.push(<Square row={i} column={j} piece={undefined}/>)
  }
}

for(let i=0, len=pieces.length; len>i; i++) {
  let piece = pieces[i];
  // Board tiles are stored in a 1D array, so this formula calculates the index of the tile in that array give its x and y position. Only works for an 8x8 board. 
  let index = ((7 - piece.y) * 8) + piece.x;
  board_tiles[index] = <Square key={`${piece.x},${piece.y}`} row={piece.y} column={piece.x} piece={piece} />
}

export default function Chessboard () {
  const [positions, setPositions] = useState(Array.from({length: 8}, () => Array.from({length: 8}, () => 0)))

  return (
    <div className="chessboard">
      {board_tiles}
    </div> 
  )
}
