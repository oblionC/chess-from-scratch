import { PIECE_TYPE } from "./referee/pieceType";

export enum COLOR {
  WHITE,
  BLACK
}

export class Piece{
    moved: boolean;
    enPassantAvailable: boolean;
    enPassantToLeft: boolean;
    enPassantToRight: boolean; 
    
    constructor(public imgPath: string, public x: number, public y: number, public type: PIECE_TYPE, public color: number)  {
      this.imgPath = imgPath;
      this.x = x;
      this.y = y;
      this.type = type;
      this.color = color; 
      this.moved = false;
      this.enPassantAvailable = false;
      this.enPassantToLeft = false;
      this.enPassantToRight = false;
    }
  }

export class Move {
  captured: boolean;
  piece: PIECE_TYPE;
  px: number;
  py: number;
  x: number;
  y: number;

  constructor(piece: PIECE_TYPE, px: number, py: number, x: number, y:number, captured: boolean) {
    this.piece = piece;
    this.px = px;
    this.py = py;
    this.x = x;
    this.y = y; 
    this.captured = captured;
  }

  createMoveString() {
    
  }
}