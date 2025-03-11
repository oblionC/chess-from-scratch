import { PIECE_TYPE } from "./pieceType"
import { Piece, COLOR, Move } from "../types" 

export default class Referee {
    turn: number;
    moves: Move[]; 

    constructor() {
        this.turn = COLOR.WHITE;
        this.moves = [];
    }

    tileOccupied(x: number, y: number, pieceArray: Piece[]): boolean {
        let piece = pieceArray.find(piece => piece.x === x && piece.y === y) 

        if(piece) return true;
        else return false;
    }

    tileOccupiedByOpponent(x: number, y: number, pieceArray: Piece[], color: COLOR) {
        let piece = pieceArray.find(piece => piece.x === x && piece.y === y && color != piece.color) 

        if(piece) return true;
        else return false;
    }

    tileOccupiedByOpponentPiece(x: number, y: number, pieceArray: Piece[], color: COLOR, pieceType: PIECE_TYPE) {
        let piece = pieceArray.find(piece => piece.x === x && piece.y === y && color != piece.color && piece.type == pieceType) 

        return piece;
    }

    isKingAttacked(king: Piece, pieceArray: Piece[]) {
        let canKillKing: boolean = false;
        pieceArray.forEach(p => {
            if(king != undefined && !canKillKing) {
                canKillKing = this.isValidMove(p.x, p.y, king.x, king.y, p, king, pieceArray);
            }
        })  
        if(canKillKing) {
            console.log("something attacking")
        }
        return canKillKing;
    }

    isDefendingKing(piece: Piece, pieceArray: Piece[]) {
        let tempx = piece.x;
        let tempy = piece.y;
        pieceArray = pieceArray.map(p => {
            if(p.x == piece.x && p.y == piece.y) {
                p.x = -1;
                p.y = -1;
            }
            return p;
        })
        let king = pieceArray.find(p => p.color == piece.color && p.type == PIECE_TYPE.KING);
        let canKillKing: boolean = false;
        if(king) {
            canKillKing = this.isKingAttacked(king, pieceArray);
        }
        pieceArray = pieceArray.map(p => {
            if(p.x == piece.x && p.y == piece.y) {
                p.x = tempx;
                p.y = tempy;
            }
            return p;
        })
        return canKillKing;
    }

    isValidMove(px: number, py: number, x: number, y: number, piece: Piece, capturedPiece: Piece | undefined, pieceArray: Piece[]) {
        
        // Not allow if not your turn
        if(this.turn !== piece.color) {
            return false;
        }

        if(capturedPiece && piece.color === capturedPiece.color) {
            return false;
        }
        // Not allow to move outside board, remove for funny xd
        if(x > 7 || x < 0 || y > 7 || y < 0) {
            return false;
        }
        // Pawns
        if(piece.type == PIECE_TYPE.PAWN) {
            let pawnIsWhite = piece.color === COLOR.WHITE
            let pawnDirection = (pawnIsWhite) ? 1 : -1;
            let specialRow = (pawnIsWhite) ? 1 : 6;

            if(piece.enPassantAvailable) {
                let direction = piece.enPassantToLeft ? -1 : 1
                if(y - py === pawnDirection && (x - px === 1 || x - px === -1)) {
                    capturedPiece = this.tileOccupiedByOpponentPiece(px + direction, py, pieceArray, piece.color, PIECE_TYPE.PAWN)
                    console.log(capturedPiece)
                    if(capturedPiece) {
                        capturedPiece.x = -1
                    }
                }
            }
            if(capturedPiece !== undefined) {
                return y - py === pawnDirection && (x - px === 1 || x - px === -1) 
            }
            else {
                if(x - px === 0 && !this.tileOccupied(px, py + pawnDirection, pieceArray)) {
                    if(py === specialRow) {
                        let twoStep = y - py === 2 * pawnDirection;
                        let oneStep = y - py === pawnDirection
                        if(twoStep) {
                            // check left and right side for a pawn
                            let p = this.tileOccupiedByOpponentPiece(x - 1, y, pieceArray, piece.color, PIECE_TYPE.PAWN)
                            if(p !== undefined) {
                                p.enPassantAvailable = true;
                                p.enPassantToRight = true;
                            }
                            p = this.tileOccupiedByOpponentPiece(x + 1, y, pieceArray, piece.color, PIECE_TYPE.PAWN)
                            if(p !== undefined) {
                                p.enPassantAvailable = true;
                                p.enPassantToLeft = true;
                            }
                        }
                        // look for if there is piece preventing 2 step move
                        return oneStep || twoStep
                    }
                    else {
                        return y - py === pawnDirection;
                    }
                }
                else return false;
            }
        }
        else if(piece.type == PIECE_TYPE.ROOK) {
            // Figure out direction
            let rookTypeMove = x === px || y === py
            if(rookTypeMove) {
                let dx = x - px;
                let dy = y - py;
                let directionX = 0;
                let directionY = 0;
                if(dx < 0) {
                    directionX = -1;
                }
                else if(dx > 0) {
                    directionX = 1;
                }

                if(dy < 0) {
                    directionY = -1;
                }
                else if(dy > 0) {
                    directionY = 1;
                }
                
                let i = px + directionX;
                let j = py + directionY;
                while(j !== y || i !== x) {
                    if(this.tileOccupied(i, j, pieceArray)) {
                        return false;
                    }
                    j += directionY; 
                    i += directionX;
                }
                piece.moved = true;
                return true;
            }
        }
        else if(piece.type == PIECE_TYPE.BISHOP) {
            let dx = x - px;
            let dy = y - py;
            let directionX = 0;
            let directionY = 0; 

            if(dx < 0) {
                directionX = -1;
            }
            else if(dx > 0) {
                directionX = 1;
            }

            if(dy < 0) {
                directionY = -1;
            }
            else if(dy > 0) {
                directionY = 1;
            }

            if(Math.abs(dx) === Math.abs(dy)) {
                let i = px + directionX;
                let j = py + directionY;
                while(j !== y && i !== x) {
                    if(this.tileOccupied(i, j, pieceArray)) {
                        return false
                    }
                    j += directionY; 
                    i += directionX;
                }
                return true;
            }
        }
        else if(piece.type === PIECE_TYPE.KING) {
            let dx = x - px;
            let dy = y - py;
            if(Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                piece.moved = true;
                return true;
            }
            // Queen side castle
            else if(dy === 0 && dx === -2) {
                let castlesAllowed = true;
                for(let i = 1; i <= 3; i++) {
                    if(this.tileOccupied(px - i, y, pieceArray)) {
                        castlesAllowed = false;
                        break;
                    }
                }
                // Get queen side rook 
                let tempRook = pieceArray.find(p => p.x === px - 4 && p.y === py)
                // Disallow castles if rook or king has moved
                if(tempRook) {
                    if(piece.moved || tempRook.moved) {
                        castlesAllowed = false;
                    }
                    if(castlesAllowed) {
                        tempRook.x = 3;
                        piece.x = 2;
                        return true;
                    }
                }
            }
            // King side castle
            else if(dy === 0 && dx == 2) {
                let castlesAllowed = true;
                for(let i = 1; i <= 3; i++) {
                    if(this.tileOccupied(px - i, y, pieceArray)) {
                        castlesAllowed = false;
                        break;
                    }
                }
                let tempRook = pieceArray.find(p => p.x === px + 3 && p.y === py)
                if(tempRook) {
                    if(piece.moved || tempRook.moved) {
                        castlesAllowed = false;
                    }
                    if(castlesAllowed) {
                        tempRook.x = 5;
                        piece.x = 6;
                        return true;
                    }
                }
            }
        }
        else if(piece.type === PIECE_TYPE.QUEEN) {
            let dx = x - px;
            let dy = y - py;
            let rookTypeMove = (x === px || y === py);
            let bishopTypemove = (Math.abs(dx) === Math.abs(dy));
            if(rookTypeMove || bishopTypemove) {
                let directionX = 0;
                let directionY = 0; 
    
                if(dx < 0) {
                    directionX = -1;
                }
                else if(dx > 0) {
                    directionX = 1;
                }
    
                if(dy < 0) {
                    directionY = -1;
                }
                else if(dy > 0) {
                    directionY = 1;
                }
                let i = px + directionX;
                let j = py + directionY;

                while(j !== y || i !== x) {
                    if(this.tileOccupied(i, j, pieceArray)) {
                        return false;
                    }
                    j += directionY; 
                    i += directionX;
                }
                return true;
            }
        }
        else if(piece.type == PIECE_TYPE.KNIGHT) {
            let dx = x - px;
            let dy = y - py;
            if(Math.abs(dx) === 2 && Math.abs(dy) === 1 || Math.abs(dx) === 1 && Math.abs(dy) === 2) {
                return true;
            }
        }
        return false
    }
}