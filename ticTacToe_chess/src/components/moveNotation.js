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

    console.log(`DEBUG generateMoveNotation: isCheck=${isCheck}, isCheckMate=${isCheckMate}, isStaleMate=${isStaleMate}`);

    if (isCheckMate) {

        notation += '#';

    } else if (isStaleMate) {

        notation += '=';

    } else if (isCheck) {

        notation += '+';
    }

    return notation;
};