// export const initBoard = [
//     ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
//     ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['', '', '', '', '', '', '', ''],
//     ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
//     ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
// ];

export const initBoard = [
    ['bk', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', 'wp'],
    ['', 'wk', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
];

export const pieceNotation = {
    p: '',
    r: 'R',
    n: 'N',
    b: 'B',
    q: 'Q',
    k: 'K'
};

export const generateMoveNotation = ({
    movingPiece,
    selected,
    row,
    col,
    isCapture,
    isCastleKingSide,
    isCastleQueenSide,
    isCheck,
    isCheckMate,
    isStaleMate,
    isEnPassant,
    isPromotion = false,
    promotedPiece = null
}) => {

    // =========================
    // CASTLING
    // =========================

    if (isCastleKingSide) {

        return isCheckMate
            ? 'O-O#'
            : isCheck
                ? 'O-O+'
                : 'O-O';
    }

    if (isCastleQueenSide) {

        return isCheckMate
            ? 'O-O-O#'
            : isCheck
                ? 'O-O-O+'
                : 'O-O-O';
    }

    const pieceType =
        movingPiece[1];

    const pieceLetter =
        pieceNotation[pieceType];

    const files =
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const targetSquare =
        `${files[col]}${8 - row}`;

    let notation = '';

    // =========================
    // PAWN MOVES
    // =========================

    if (pieceType === 'p') {

        if (isCapture || isEnPassant) {

            notation =
                `${files[selected[1]]}x${targetSquare}`;

        } else {

            notation = targetSquare;
        }

    } else {

        notation = pieceLetter;

        if (isCapture) {

            notation += 'x';
        }

        notation += targetSquare;
    }

    // =========================
    // PROMOTION
    // =========================

    if (isPromotion && promotedPiece) {

        notation +=
            `=${pieceNotation[promotedPiece]}`;
    }

    // =========================
    // CHECK / CHECKMATE / STALEMATE
    // =========================

    if (isCheckMate) {

        notation += '#';

    } else if (isStaleMate) {

        notation += '=';

    } else if (isCheck) {

        notation += '+';
    }

    return notation;
};

export const getStatusInfo = (
    turn,
    gameResult,
    playerColor
) => {

    if (gameResult?.title === "Checkmate") {

        const winnerType =
            gameResult.winner === playerColor
                ? "You"
                : "AI";

        return {
            text: `${gameResult.winner} wins! (${winnerType})`,
            textColor: "text-white"
        };
    }

    if (gameResult?.title === "Stalemate") {

        return {
            text: "Draw (Stalemate)",
            textColor: "text-white"
        };
    }

    return {
        text:
            `${turn}'s turn (${
                turn === playerColor
                    ? "you"
                    : "AI"
            })`,
        textColor:
            turn === "white"
                ? "text-white"
                : "text-black"
    };
};