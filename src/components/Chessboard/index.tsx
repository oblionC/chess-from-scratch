import { useState, useRef } from 'react'
import { cordinatesToIndex } from '../../utility/cordinatesToIndex'
import Square from "../Square"
import "./Chessboard.css"
import { Piece, COLOR, Move } from "../types"
import { TILE_LENGTH } from "../../constants"
import Referee from '../referee/referee'
import { PIECE_TYPE } from '../referee/pieceType'

let pieces: Piece[] = []
// Black pawns
for(let i = 0; i < 8; i++) {
  let piece = new Piece("assets/images/pawn_b.png", i, 6, PIECE_TYPE.PAWN, COLOR.BLACK);
  pieces.push(piece);
}
// White pawns
for(let i = 0; i < 8; i++) {
  let piece = new Piece("assets/images/pawn_w.png", i, 1, PIECE_TYPE.PAWN, COLOR.WHITE);
  pieces.push(piece);
}
// Rooks
pieces.push(new Piece("assets/images/rook_b.png", 0, 7, PIECE_TYPE.ROOK, COLOR.BLACK));
pieces.push(new Piece("assets/images/rook_b.png", 7, 7, PIECE_TYPE.ROOK, COLOR.BLACK));
pieces.push(new Piece("assets/images/rook_w.png", 0, 0, PIECE_TYPE.ROOK, COLOR.WHITE));
pieces.push(new Piece("assets/images/rook_w.png", 7, 0, PIECE_TYPE.ROOK, COLOR.WHITE));

// Knights
pieces.push(new Piece("assets/images/knight_b.png", 1, 7, PIECE_TYPE.KNIGHT, COLOR.BLACK));
pieces.push(new Piece("assets/images/knight_b.png", 6, 7, PIECE_TYPE.KNIGHT, COLOR.BLACK));
pieces.push(new Piece("assets/images/knight_w.png", 1, 0, PIECE_TYPE.KNIGHT, COLOR.WHITE));
pieces.push(new Piece("assets/images/knight_w.png", 6, 0, PIECE_TYPE.KNIGHT, COLOR.WHITE));

// Bishops
pieces.push(new Piece("assets/images/bishop_b.png", 2, 7, PIECE_TYPE.BISHOP, COLOR.BLACK));
pieces.push(new Piece("assets/images/bishop_b.png", 5, 7, PIECE_TYPE.BISHOP, COLOR.BLACK));
pieces.push(new Piece("assets/images/bishop_w.png", 2, 0, PIECE_TYPE.BISHOP, COLOR.WHITE));
pieces.push(new Piece("assets/images/bishop_w.png", 5, 0, PIECE_TYPE.BISHOP, COLOR.WHITE));

// Kings
pieces.push(new Piece("assets/images/king_b.png", 4, 7, PIECE_TYPE.KING, COLOR.BLACK));
pieces.push(new Piece("assets/images/king_w.png", 4, 0, PIECE_TYPE.KING, COLOR.WHITE));

// Queen
pieces.push(new Piece("assets/images/queen_b.png", 3, 7, PIECE_TYPE.QUEEN, COLOR.BLACK));
pieces.push(new Piece("assets/images/queen_w.png", 3, 0, PIECE_TYPE.QUEEN, COLOR.WHITE));


export default function Chessboard () {
  const [boardState, setBoardState] = useState<Piece[]>(pieces)
  const chessboardRef = useRef<HTMLDivElement>(null)
  const refereeRef = useRef<Referee>(new Referee())
  let referee = refereeRef.current;

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
    if(chessboard !== null)
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
        let pieces = value.map(piece => {return piece});
        let startPieceIndex = -1;  

        for(let i = 0; i < value.length; i++) {
          let p = pieces[i]
          if(p.x === startXIndex && p.y === startYIndex) {
            startPieceIndex = i;
          }
        }

        if(startPieceIndex != -1) {
          // Check for captured piece
          let capturedPiece: Piece | undefined = undefined; 
          for(let i = 0; i < pieces.length; i++) {
            let p = pieces[i];
            // Delete captured piece
            if(p.x === endXIndex && p.y === endYIndex) {
              // Captured piece
              capturedPiece = p;
              break; 
              // pieces[i].x = -1;
            }
          }
          let moveIsValid = referee.isValidMove(startXIndex, startYIndex, endXIndex, endYIndex, pieces[startPieceIndex], capturedPiece, pieces);
          let defendingKing = referee.isDefendingKing(pieces[startPieceIndex], pieces)
          if(moveIsValid && !defendingKing) {
            if(capturedPiece)
              capturedPiece.x = -1;
            let tempPiece = pieces[startPieceIndex];
            tempPiece.x = endXIndex;
            tempPiece.y = endYIndex;
            referee.turn = referee.turn === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
            referee.moves.push(new Move(pieces[startPieceIndex].type, startXIndex, startYIndex, endXIndex, endYIndex, capturedPiece ? true : false))
            for(let i = 0; i < pieces.length; i++) {
              let piece = pieces[i];
              if(piece.color === tempPiece.color && piece.enPassantAvailable) {
                piece.enPassantAvailable = false;
                piece.enPassantToLeft = false;
                piece.enPassantToRight = false;
              }
            }
          }
          
        }
        if(activePiece){
          activePiece.style.position = "relative";
          activePiece.style.top = `0px`;
          activePiece.style.left = `0px`;
        }
        return pieces;
      })
    }
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
