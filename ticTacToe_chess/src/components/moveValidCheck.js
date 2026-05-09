const checkPossibleMoveCondition = (
    board,
    movingPieceColor,
    row,
    col
) => {

    // out of bounds
    if (
        row < 0 ||
        row >= 8 ||
        col < 0 ||
        col >= 8
    ) {
        return [false, false];
    }

    // empty square
    if (board[row][col] === '') {
        return [true, true];
    }

    const pieceColor =
        board[row][col][0] === 'w'
            ? 'white'
            : 'black';

    // same color piece
    if (pieceColor === movingPieceColor) {
        return [false, false];
    }

    // enemy piece
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

            const [append_flag, continue_flag] =
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

const generateRookMoves = (board, selected) => {

    const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
    ];

    return generateSlidingMoves(
        board,
        selected,
        directions
    );
};

const generateBishopMoves = (board, selected) => {

    const directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];

    return generateSlidingMoves(
        board,
        selected,
        directions
    );
};

const generateQueenMoves = (board, selected) => {

    const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];

    return generateSlidingMoves(
        board,
        selected,
        directions
    );
};

const generateKnightMoves = (board, selected) => {

    const curRow = selected[0];
    const curCol = selected[1];

    const movingPieceColor =
        board[curRow][curCol][0] === 'w'
            ? 'white'
            : 'black';

    let possibleMoves = [];

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

    for (const [rowOffset, colOffset] of knightMoves) {

        const row = curRow + rowOffset;
        const col = curCol + colOffset;

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

const generateKingMoves = (board, selected) => {

    const curRow = selected[0];
    const curCol = selected[1];

    const movingPieceColor =
        board[curRow][curCol][0] === 'w'
            ? 'white'
            : 'black';

    let possibleMoves = [];

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

    for (const [rowOffset, colOffset] of kingMoves) {

        const row = curRow + rowOffset;
        const col = curCol + colOffset;

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
    pieceColor
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

    let increments = [];

    // move forward
    increments.push([
        forwardDirection,
        0
    ]);

    // double move
    if (curRow === startRow) {

        increments.push([
            forwardDirection * 2,
            0
        ]);
    }

    // captures
    increments.push([
        forwardDirection,
        -1
    ]);

    increments.push([
        forwardDirection,
        1
    ]);

    let possibleMoves = [];
};

export const isMoveValid = (
    board,
    selected,
    turn,
    row,
    col
) => {
    const pieceColor =
        board[selected[0]][selected[1]][0] === 'w'
            ? 'white'
            : 'black';

    const piece =
        board[selected[0]][selected[1]][1];

    // turn validation
    if (pieceColor !== turn) {
        return false;
    }

    let possibleMoves = [];

    switch (piece) {

        case "r":
            possibleMoves =
                generateRookMoves(board, selected);
            break;

        case "b":
            possibleMoves =
                generateBishopMoves(board, selected);
            break;

        case "q":
            possibleMoves =
                generateQueenMoves(board, selected);
            break;

        case "n":
            possibleMoves =
                generateKnightMoves(board, selected);
            break;

        case "k":
            possibleMoves =
                generateKingMoves(board, selected);
            break;
        case "p":
            return true;

        default:
            return false;
    }

    console.log(possibleMoves);

    return possibleMoves.some(
        ([moveRow, moveCol]) =>
            moveRow === row &&
            moveCol === col
    );
};