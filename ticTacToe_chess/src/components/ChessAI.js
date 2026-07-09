import {
    isCheckMate,
    isStaleMate
} from './moveValidCheck';

const chessPiecePoints = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
};

class ChessMinMaxAlgo {
    constructor() { }

    evaluateBoard(board) {
        let score = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece === "") continue;

                const value = chessPiecePoints[piece[1]];

                if (piece[0] === "w") {
                    score += value;
                } else {
                    score -= value;
                }
            }
        }

        return score;
    }

    minMax(board, pieceColor, enPassantState, castleState, moveCount, curDepth, MaxDepth) {
        //// Terminal States
        if (isCheckMate(
            board, pieceColor,
            enPassantState, moveCount + 1
        )) {
            if (pieceColor === "white") { // black wins
                return -1000;
            } else if (pieceColor === "black") { // white wins
                return 1000;
            }
        };

        if (isStaleMate(
            board, pieceColor,
            enPassantState, moveCount + 1
        )) {
            return 0;
        }

        if (curDepth == MaxDepth) {

        }

    }
}