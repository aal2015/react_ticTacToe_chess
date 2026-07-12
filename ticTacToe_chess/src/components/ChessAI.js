import {
    isCheckMate,
    isStaleMate,
    generateMovesForPiece,
    wouldKingBeInCheckAfterMove
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
                return {
                    score: -1000 + curDepth,
                    move: null
                };
            } else if (pieceColor === "black") { // white wins
                return {
                    score: 1000 - curDepth,
                    move: null
                };
            }
        };

        if (isStaleMate(
            board, pieceColor,
            enPassantState, moveCount + 1
        )) {
            return {
                score: 0,
                move: null
            };
        }

        if (curDepth == MaxDepth) {
            return {
                score: this.evaluateBoard(board),
                move: null
            };
        }

        let bestScore;
        if (pieceColor === "white") {
            bestScore = -Infinity;
        } else {
            bestScore = Infinity;
        }

        let bestMove = null;

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

                        boardClone[capturedPawnRow][moveCol] = '';
                    }

                    // simulate move
                    boardClone[moveRow][moveCol] = piece;
                    boardClone[row][col] = '';

                    // pawn promotion
                    let promotionPiece = null;
                    if (
                        piece[1] === "p" &&
                        (
                            (pieceColor === "white" && moveRow === 0) ||
                            (pieceColor === "black" && moveRow === 7)
                        )
                    ) {
                        // Always promote to queen
                        boardClone[moveRow][moveCol] =
                            piece[0] + "q";
                        promotionPiece = "q";
                    }

                    // update en passant
                    let nextEnPassantState = null;
                    if (
                        piece[1] === "p" &&
                        Math.abs(moveRow - row) === 2
                    ) {

                        nextEnPassantState = {
                            row: moveRow,
                            col: moveCol,
                            pieceColor,
                            moveCount: moveCount + 1
                        };
                    }

                    // update castle state
                    const newCastleState = {
                        ...castleState
                    };

                    if (piece === "wk") {
                        newCastleState.whiteKingMoved = true;
                    }

                    if (piece === "bk") {
                        newCastleState.blackKingMoved = true;
                    }

                    if (
                        piece === "wr" &&
                        row === 7 &&
                        col === 0
                    ) {
                        newCastleState.whiteLeftRookMoved = true;
                    }

                    if (
                        piece === "wr" &&
                        row === 7 &&
                        col === 7
                    ) {
                        newCastleState.whiteRightRookMoved = true;
                    }

                    if (
                        piece === "br" &&
                        row === 0 &&
                        col === 0
                    ) {
                        newCastleState.blackLeftRookMoved = true;
                    }

                    if (
                        piece === "br" &&
                        row === 0 &&
                        col === 7
                    ) {
                        newCastleState.blackRightRookMoved = true;
                    }

                    // castle movements (rook)

                    // white king side
                    if (
                        piece === "wk" &&
                        col === 4 &&
                        moveCol === 6
                    ) {
                        boardClone[7][5] = "wr";
                        boardClone[7][7] = "";
                    }

                    // white queen side
                    if (
                        piece === "wk" &&
                        col === 4 &&
                        moveCol === 2
                    ) {

                        boardClone[7][3] = 'wr';
                        boardClone[7][0] = '';
                    }

                    // black king side
                    if (
                        piece === "bk" &&
                        col === 4 &&
                        moveCol === 6
                    ) {
                        boardClone[0][5] = "br";
                        boardClone[0][7] = "";
                    }

                    // black queen side
                    if (
                        piece === "bk" &&
                        col === 4 &&
                        moveCol === 2
                    ) {
                        boardClone[0][3] = "br";
                        boardClone[0][0] = "";
                    }

                    // check for illegal self-check moves
                    if (
                        wouldKingBeInCheckAfterMove(
                            boardClone,
                            pieceColor
                        )
                    ) {
                        continue;
                    }

                    // next player
                    const nextColor =
                        pieceColor === "white"
                            ? "black"
                            : "white";

                    // recursive call
                    const result =
                        this.minMax(
                            boardClone,
                            nextColor,
                            nextEnPassantState,
                            newCastleState,
                            moveCount + 1,
                            curDepth + 1,
                            MaxDepth
                        );

                    const score = result.score;

                    // update best score
                    if (pieceColor === "white") {
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = {
                                from: [row, col],
                                to: [moveRow, moveCol],
                                promotion: promotionPiece
                            };
                        }
                    }
                    else {
                        if (score < bestScore) {
                            bestScore = score;
                            bestMove = {
                                from: [row, col],
                                to: [moveRow, moveCol],
                                promotion: promotionPiece
                            };
                        }
                    }
                }

            }
        }

        return {
            score: bestScore,
            move: bestMove
        };
    }
}