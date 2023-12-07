import { useState, useRef, useEffect } from 'react'
import { cordinatesToIndex } from '../../utility/cordinatesToIndex'
import Square from "../Square"
import "./Chessboard.css"
import Piece from "../types"
import { TILE_LENGTH } from "../../constants"



let pieces: Piece[] = []
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



export default function Chessboard () {
  const [boardState, setBoardState] = useState<Piece[]>(pieces)
  const chessboardRef = useRef(null)

  let activePiece: undefined | HTMLElement = undefined;
  let chessboard = chessboardRef.current;
  let rect: any;
  let w: number;
  let h: number;
  let startXIndex: number, startYIndex: number;
  let endXIndex: number, endYIndex: number;

  function grabPiece(e: React.MouseEvent) {
    let element = e.target as HTMLElement
    
    chessboard = chessboardRef.current
    rect = chessboard.getBoundingClientRect();
    w = rect.right - rect.left;
    h = rect.bottom - rect.top;

    // Finds x and y position of piece on board using its position relative to the chessboard
    const x = e.clientX;
    const y = e.clientY;
    const x_rel = x - rect.left;
    const y_rel = rect.bottom - y;
    startXIndex = Math.ceil(x_rel / TILE_LENGTH) - 1
    startYIndex = Math.ceil(y_rel / TILE_LENGTH) - 1

    if(element.classList.contains("piece")){
      activePiece = element
    }
  }

  function movePiece(e: React.MouseEvent) {
    if(activePiece) {
      const element = activePiece
      const x = e.clientX;
      const y = e.clientY;

      if(chessboard) {
        element.style.position = "absolute";
        element.style.top = `${y - TILE_LENGTH / 2}px`;
        element.style.left = `${x - TILE_LENGTH / 2}px`;

        // Bound piece to the board
        if(x < rect.left) {
          element.style.left = `${rect.left - TILE_LENGTH / 2}px`;
        }
        else if(x > rect.left + w) {
          element.style.left = `${rect.left + w - TILE_LENGTH / 2}px`;
        }
        
        if (y < rect.top) {
          element.style.top = `${rect.top - TILE_LENGTH / 2}px`;
        }
        else if (y > rect.top + h) {
          element.style.top  = `${rect.top + w - TILE_LENGTH / 2}px`;
        }
      }
    }
  }

  function releasePiece(e: React.MouseEvent) {
    if(activePiece) {
      const x = e.clientX;
      const y = e.clientY;
      const x_rel = x - rect.left;
      const y_rel = rect.bottom - y;
      endXIndex = Math.ceil(x_rel / TILE_LENGTH) - 1
      endYIndex = Math.ceil(y_rel / TILE_LENGTH) - 1
      


      setBoardState(value => {
        console.log(startXIndex, startYIndex)
        console.log(endXIndex, endYIndex) 
        const pieces = value.map(p => {
          let piece = p;
          let startFound = false;
          if(p.x === startXIndex && p.y === startYIndex) {
            startFound = true;
            piece.x = endXIndex;
            piece.y = endYIndex;
          }
          else if(p.x === endXIndex && p.y === endYIndex && startFound) {
            piece.x = -1;
          }
          return piece;
        })
        return pieces;
      })
      console.log(boardState)


    }
    
    activePiece = undefined
}

let board_tiles: any[] = []
for(let i = 7; i >= 0; i--) {
  for(let j = 0; j <= 7; j++) {
    board_tiles.push(<Square key={`${j},${i}`} row={i} column={j} piece={undefined}/>)
  }
}

for(let i=0, len=boardState.length; len>i; i++) {
  let piece = boardState[i];
  if(piece.x != -1) {
  // Board tiles are stored in a 1D array, so this formula calculates the index of the tile in that array give its x and y position. Only works for an 8x8 board. 
  let index = cordinatesToIndex(piece.x, piece.y)
  board_tiles[index] = <Square key={`${piece.x},${piece.y}`} row={piece.y} column={piece.x} piece={piece} />
  }

}

  return (
    <div className="chessboard" onMouseDown={e => grabPiece(e)} onMouseUp={e => releasePiece(e)} onMouseMove={e => movePiece(e)} ref={chessboardRef}>
      {board_tiles}
    </div> 
  )
}
