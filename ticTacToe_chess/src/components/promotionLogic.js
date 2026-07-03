import {
    wouldKingBeInCheckAfterMove,
    isCheckMate,
    isStaleMate
} from './moveValidCheck';
import { generateMoveNotation } from './moveNotation';

export const handlePromotion = (
    boardClone,
    selected,
    movingPiece,
    row,
    col,
    isCapture,
    isEnPassant,
    turn,
    moveCount,
    castleState,
    enPassantState,
    moveHistory,
    promotedPiece
) => {
    // =========================
    // BOARD CLONING & CASTLE STATE
    // =========================
    const newCastleState = { ...castleState };

    // promote pawn
    boardClone[row][col] = movingPiece[0] + promotedPiece;

    // console.log(boardClone[row][col]);

    const enemyColor =
        turn === 'white'
            ? 'black'
            : 'white';

    // check if checkmate
    const checkMateState =
        isCheckMate(
            boardClone,
            enemyColor,
            isEnPassant,
            moveCount + 1
        );

    const stalemateState = isStaleMate(
        boardClone,
        enemyColor,
        isEnPassant,
        moveCount + 1
    );


    // TODO: add stalemate

    const notation =
        generateMoveNotation({
            movingPiece,
            selected,
            row,
            col,
            isCapture,
            isEnPassant,
            isCheck: false,
            isCheckMate: checkMateState,
            isStaleMate: stalemateState,
            isPromotion: true,
            promotedPiece
        });

    const updatedHistory = [...moveHistory];

    if (turn === "white") {
        updatedHistory.push({
            moveNumber: Math.floor(moveCount / 2) + 1,
            white: notation,
            black: ""
        });
    } else {
        updatedHistory[
            updatedHistory.length - 1
        ].black = notation;
    }

    return {
        updatedBoardClone: boardClone,
        updatedCastleState: newCastleState,
        updatedEnPassantState: enPassantState,
        updatedHistory: updatedHistory,
        udpdatedTurn:
            turn === "white"
                ? "black"
                : "white",
        updatedMoveCount:
            moveCount + 1,
        checkMateState: checkMateState,
        stalemateState: stalemateState
    };
};