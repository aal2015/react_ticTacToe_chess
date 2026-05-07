const checkPossibleMoveCondition = (
    board,
    movingPieceColor,
    row,
    col
) => {

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

const generateRookMoves = (board, selected) => {

    const curRow = selected[0];
    const curCol = selected[1];

    const movingPieceColor =
        board[curRow][curCol][0] === 'w'
            ? 'white'
            : 'black';

    let possibleMoves = [];

    // LEFT
    for (let col = curCol - 1; col >= 0; col--) {

        const [append_flag, continue_flag] =
            checkPossibleMoveCondition(
                board,
                movingPieceColor,
                curRow,
                col
            );

        if (append_flag) {
            possibleMoves.push([curRow, col]);
        }

        if (!continue_flag) {
            break;
        }
    }

    // RIGHT
    for (let col = curCol + 1; col < 8; col++) {

        const [append_flag, continue_flag] =
            checkPossibleMoveCondition(
                board,
                movingPieceColor,
                curRow,
                col
            );

        if (append_flag) {
            possibleMoves.push([curRow, col]);
        }

        if (!continue_flag) {
            break;
        }
    }

    // UP
    for (let row = curRow - 1; row >= 0; row--) {

        const [append_flag, continue_flag] =
            checkPossibleMoveCondition(
                board,
                movingPieceColor,
                row,
                curCol
            );

        if (append_flag) {
            possibleMoves.push([row, curCol]);
        }

        if (!continue_flag) {
            break;
        }
    }

    // DOWN
    for (let row = curRow + 1; row < 8; row++) {

        const [append_flag, continue_flag] =
            checkPossibleMoveCondition(
                board,
                movingPieceColor,
                row,
                curCol
            );

        if (append_flag) {
            possibleMoves.push([row, curCol]);
        }

        if (!continue_flag) {
            break;
        }
    }

    return possibleMoves;
};

export const isMoveValid = (board, selected, turn, row, col) => {
    const pieceColor = board[selected[0]][selected[1]][0] === 'w' ? "white" : "black";
    const piece = board[selected[0]][selected[1]][1];

    // check turn validation
    if (pieceColor !== turn) {
        return false;
    }

    // generate possible piece moves for move validation
    switch (piece) {
        case "r":
            console.log(generateRookMoves(board, selected));
    }

    return true;
}