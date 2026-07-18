import {
    isCheckMate,
    isStaleMate,
    generateMovesForPiece,
    wouldKingBeInCheckAfterMove,
    handleCastleMove,
    handleEnPassant
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

    minMax(board, pieceColor, enPassantState, castleState, moveCount, curDepth, MaxDepth, alpha, beta) {
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

        const pieceCode =
            pieceColor === "white"
                ? "w"
                : "b";

        // generate all possible moves
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // find the color piece
                const piece = board[row][col];
                if (piece === '') {
                    continue;
                }

                if (piece[0] !== pieceCode) {
                    continue;
                }

                // generate all possible moves
                const possibleMoves = generateMovesForPiece(
                    board, piece, row, col, pieceColor, castleState, enPassantState,
                    moveCount
                );

                for (const [moveRow, moveCol] of possibleMoves) {
                    moves.push({
                        piece,
                        fromRow: row,
                        fromCol: col,
                        toRow: moveRow,
                        toCol: moveCol
                    });
                }
            }
        }

        for (const move of moves) {
            const {
                piece,
                fromRow,
                fromCol,
                toRow,
                toCol
            } = move;

            const boardClone =
                board.map(
                    boardRow => [...boardRow]
                );

            // EN PASSANT CAPTURE
            const { isEnPassant } = handleEnPassant(
                boardClone,
                piece,
                pieceColor,
                fromCol,
                toRow,
                toCol
            );

            // handle castle
            const {
                castleState: newCastleState,
                isCastleKingSide,
                isCastleQueenSide
            } = handleCastleMove(
                boardClone,
                castleState,
                piece,
                fromRow,
                fromCol,
                toRow,
                toCol
            );

            // simulate move
            boardClone[toRow][toCol] = piece;
            boardClone[fromRow][fromCol] = '';

            // pawn promotion
            let promotionPiece = null;
            if (
                piece[1] === "p" &&
                (
                    (pieceColor === "white" && toRow === 0) ||
                    (pieceColor === "black" && toRow === 7)
                )
            ) {
                // Always promote to queen
                boardClone[toRow][toCol] =
                    piece[0] + "q";
                promotionPiece = "q";
            }

            // update en passant
            let nextEnPassantState = null;
            if (
                piece[1] === "p" &&
                Math.abs(toRow - fromRow) === 2
            ) {

                nextEnPassantState = {
                    row: toRow,
                    col: toCol,
                    pieceColor,
                    moveCount: moveCount + 1
                };
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
                    MaxDepth,
                    alpha,
                    beta
                );

            const score = result.score;

            // update best score
            if (pieceColor === "white") {
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = {
                        from: [fromRow, fromCol],
                        to: [toRow, toCol],
                        promotion: promotionPiece
                    };
                }
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha)
                    break;
            }
            else {
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = {
                        from: [fromRow, fromCol],
                        to: [toRow, toCol],
                        promotion: promotionPiece
                    };
                }
                beta = Math.min(beta, bestScore);
                if (beta <= alpha)
                    break;
            }
        }

        return {
            score: bestScore,
            move: bestMove
        };
    }
}