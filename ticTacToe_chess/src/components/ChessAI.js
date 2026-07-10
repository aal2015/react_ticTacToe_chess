import {
    isCheckMate,
    isStaleMate,
    generateMovesForPiece
} from './moveValidCheck';

const chessPiecePoints = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
};

export class ChessMinMaxAlgo {
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
            return this.evaluateBoard(board);
        }

        //// steps:
        // find the color piece
        // generate all possible moves
        // Try every move on clone board
        // call minmax function
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // find the color piece
                const piece = board[row][col];
                if (piece === '') {
                    continue;
                }

                const pieceCode =
                    pieceColor === "white"
                        ? "w"
                        : "b";

                if (piece[0] !== pieceCode) {
                    continue;
                }

                // generate all possible moves
                const possibleMoves = generateMovesForPiece(
                    board, piece, row, col, pieceColor, castleState, enPassantState,
                    moveCount
                )

                // Try every move on clone board
                for (const [moveRow, moveCol] of possibleMoves) {
                    const boardClone =
                        board.map(
                            boardRow => [...boardRow]
                        );

                    // EN PASSANT CAPTURE
                    if (
                        piece[1] === 'p' &&
                        moveCol !== col &&
                        board[moveRow][moveCol] === ''
                    ) {
                        const capturedPawnRow =
                            pieceColor === 'white'
                                ? moveRow + 1
                                : moveRow - 1;

                        boardClone[
                            capturedPawnRow
                        ][
                            moveCol
                        ] = '';
                    }

                    // simulate move
                    boardClone[moveRow][moveCol] =
                        piece;
                    boardClone[row][col] = '';

                    const nextColor =
                        pieceColor === "white"
                            ? "black"
                            : "white";

                    // recursive call
                    const score = this.minMax(
                        boardClone, nextColor, enPassantState, castleState, moveCount,
                        curDepth + 1, MaxDepth
                    )
                }

            }
        }
    }
}