const checkPossibleMoveCondition = (
    board,
    movingPieceColor,
    row,
    col
) => {

    if (
        row < 0 ||
        row >= 8 ||
        col < 0 ||
        col >= 8
    ) {
        return [false, false];
    }

    if (board[row][col] === '') {
        return [true, true];
    }

    const pieceColor =
        board[row][col][0] === 'w'
            ? 'white'
            : 'black';

    if (pieceColor === movingPieceColor) {
        return [false, false];
    }

    return [true, false];
};

const generateSlidingMoves = (
    board,
    selected,
    directions
) => {

    const curRow = selected[0];
    const curCol = selected[1];

    const movingPieceColor =
        board[curRow][curCol][0] === 'w'
            ? 'white'
            : 'black';

    let possibleMoves = [];

    for (const [rowDir, colDir] of directions) {

        let row = curRow + rowDir;
        let col = curCol + colDir;

        while (
            row >= 0 &&
            row < 8 &&
            col >= 0 &&
            col < 8
        ) {

            const [
                append_flag,
                continue_flag
            ] =
                checkPossibleMoveCondition(
                    board,
                    movingPieceColor,
                    row,
                    col
                );

            if (append_flag) {
                possibleMoves.push([row, col]);
            }

            if (!continue_flag) {
                break;
            }

            row += rowDir;
            col += colDir;
        }
    }

    return possibleMoves;
};

const generateRookMoves = (
    board,
    selected
) => {

    return generateSlidingMoves(
        board,
        selected,
        [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
        ]
    );
};

const generateBishopMoves = (
    board,
    selected
) => {

    return generateSlidingMoves(
        board,
        selected,
        [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ]
    );
};

const generateQueenMoves = (
    board,
    selected
) => {

    return generateSlidingMoves(
        board,
        selected,
        [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ]
    );
};

const generateKnightMoves = (
    board,
    selected
) => {

    const curRow = selected[0];
    const curCol = selected[1];

    const movingPieceColor =
        board[curRow][curCol][0] === 'w'
            ? 'white'
            : 'black';

    const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];

    let possibleMoves = [];

    for (
        const [rowOffset, colOffset]
        of knightMoves
    ) {

        const row =
            curRow + rowOffset;

        const col =
            curCol + colOffset;

        const [append_flag] =
            checkPossibleMoveCondition(
                board,
                movingPieceColor,
                row,
                col
            );

        if (append_flag) {
            possibleMoves.push([row, col]);
        }
    }

    return possibleMoves;
};

const generateKingMoves = (
    board,
    selected
) => {

    const curRow = selected[0];
    const curCol = selected[1];

    const movingPieceColor =
        board[curRow][curCol][0] === 'w'
            ? 'white'
            : 'black';

    const kingMoves = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];

    let possibleMoves = [];

    for (
        const [rowOffset, colOffset]
        of kingMoves
    ) {

        const row =
            curRow + rowOffset;

        const col =
            curCol + colOffset;

        const [append_flag] =
            checkPossibleMoveCondition(
                board,
                movingPieceColor,
                row,
                col
            );

        if (append_flag) {
            possibleMoves.push([row, col]);
        }
    }

    return possibleMoves;
};

const generatePawnMoves = (
    board,
    selected,
    pieceColor,
    enPassantState,
    moveCount
) => {

    const curRow = selected[0];
    const curCol = selected[1];

    const forwardDirection =
        pieceColor === 'white'
            ? -1
            : 1;

    const startRow =
        pieceColor === 'white'
            ? 6
            : 1;

    const enemyColor =
        pieceColor === 'white'
            ? 'black'
            : 'white';

    let possibleMoves = [];

    // FORWARD ONE

    const oneStepRow =
        curRow + forwardDirection;

    if (
        oneStepRow >= 0 &&
        oneStepRow < 8 &&
        board[oneStepRow][curCol] === ''
    ) {

        possibleMoves.push([
            oneStepRow,
            curCol
        ]);

        // FORWARD TWO

        const twoStepRow =
            curRow + forwardDirection * 2;

        if (
            curRow === startRow &&
            board[twoStepRow][curCol] === ''
        ) {

            possibleMoves.push([
                twoStepRow,
                curCol
            ]);
        }
    }

    // CAPTURES

    const captureOffsets = [-1, 1];

    for (const colOffset of captureOffsets) {

        const captureRow =
            curRow + forwardDirection;

        const captureCol =
            curCol + colOffset;

        if (
            captureRow < 0 ||
            captureRow >= 8 ||
            captureCol < 0 ||
            captureCol >= 8
        ) {
            continue;
        }

        const targetPiece =
            board[captureRow][captureCol];

        if (targetPiece !== '') {

            const targetPieceColor =
                targetPiece[0] === 'w'
                    ? 'white'
                    : 'black';

            if (
                targetPieceColor === enemyColor
            ) {

                possibleMoves.push([
                    captureRow,
                    captureCol
                ]);
            }
        }
    }

    // EN PASSANT

    if (
        enPassantState &&
        moveCount -
        enPassantState.moveCount === 1
    ) {

        const {
            row,
            col,
            pieceColor: enemyPawnColor
        } = enPassantState;

        if (
            enemyPawnColor === enemyColor
        ) {

            // LEFT

            if (
                row === curRow &&
                col === curCol - 1
            ) {

                possibleMoves.push([
                    curRow + forwardDirection,
                    curCol - 1
                ]);
            }

            // RIGHT

            if (
                row === curRow &&
                col === curCol + 1
            ) {

                possibleMoves.push([
                    curRow + forwardDirection,
                    curCol + 1
                ]);
            }
        }
    }

    return possibleMoves;
};

export const isMoveValid = (
    board,
    selected,
    turn,
    row,
    col,
    enPassantState,
    moveCount
) => {

    const pieceColor =
        board[selected[0]][selected[1]][0] === 'w'
            ? 'white'
            : 'black';

    const piece =
        board[selected[0]][selected[1]][1];

    if (pieceColor !== turn) {
        return false;
    }

    let possibleMoves = [];

    switch (piece) {

        case 'r':
            possibleMoves =
                generateRookMoves(
                    board,
                    selected
                );
            break;

        case 'b':
            possibleMoves =
                generateBishopMoves(
                    board,
                    selected
                );
            break;

        case 'q':
            possibleMoves =
                generateQueenMoves(
                    board,
                    selected
                );
            break;

        case 'n':
            possibleMoves =
                generateKnightMoves(
                    board,
                    selected
                );
            break;

        case 'k':
            possibleMoves =
                generateKingMoves(
                    board,
                    selected
                );
            break;

        case 'p':
            possibleMoves =
                generatePawnMoves(
                    board,
                    selected,
                    pieceColor,
                    enPassantState,
                    moveCount
                );
            break;

        default:
            return false;
    }

    return possibleMoves.some(
        ([moveRow, moveCol]) =>
            moveRow === row &&
            moveCol === col
    );
};