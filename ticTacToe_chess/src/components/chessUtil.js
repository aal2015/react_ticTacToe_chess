export const initBoard = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

export const initCastleState = {
    whiteKingMoved: false,
    blackKingMoved: false,

    whiteLeftRookMoved: false,
    whiteRightRookMoved: false,

    blackLeftRookMoved: false,
    blackRightRookMoved: false
};

export const pieceNotation = {
    p: '',
    r: 'R',
    n: 'N',
    b: 'B',
    q: 'Q',
    k: 'K'
};

export const chessPiecePoints = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
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
            `${turn}'s turn (${turn === playerColor
                ? "you"
                : "AI"
            })`,
        textColor:
            turn === "white"
                ? "text-white"
                : "text-black"
    };
};


export const calculateMaterialScore = (board) => {
    let whiteScore = 0;
    let blackScore = 0;

    for (const row of board) {
        for (const piece of row) {
            if (piece === '') continue;

            const value = chessPiecePoints[piece[1]];

            if (piece[0] === 'w') {
                whiteScore += value;
            } else {
                blackScore += value;
            }
        }
    }

    return {
        white: whiteScore,
        black: blackScore,
        difference: whiteScore - blackScore
    };
};

export const getCapturedPieces = (board) => {
    const initialPieces = {
        w: {
            p: 8,
            r: 2,
            n: 2,
            b: 2,
            q: 1,
            k: 1
        },
        b: {
            p: 8,
            r: 2,
            n: 2,
            b: 2,
            q: 1,
            k: 1
        }
    };

    const currentPieces = {
        w: {
            p: 0,
            r: 0,
            n: 0,
            b: 0,
            q: 0,
            k: 0
        },
        b: {
            p: 0,
            r: 0,
            n: 0,
            b: 0,
            q: 0,
            k: 0
        }
    };

    // Count pieces currently on the board
    for (const row of board) {
        for (const piece of row) {
            if (piece === '') continue;

            const color = piece[0];
            const type = piece[1];

            currentPieces[color][type]++;
        }
    }

    const captured = {
        w: [],
        b: []
    };

    // Find missing pieces
    for (const color of ['w', 'b']) {
        for (const type of ['p', 'r', 'n', 'b', 'q', 'k']) {

            const missing =
                initialPieces[color][type] -
                currentPieces[color][type];

            for (let i = 0; i < missing; i++) {
                captured[color].push(type);
            }
        }
    }

    return captured;
};