export const generateMovesForPiece = (
    board,
    piece,
    row,
    col,
    pieceColor,
    castleState = null,
    enPassantState = null,
    moveCount = 0
) => {
    const selected = [row, col];

    switch (piece[1]) {

        case "r":
            return generateRookMoves(
                board,
                selected
            );

        case "b":
            return generateBishopMoves(
                board,
                selected
            );

        case "q":
            return generateQueenMoves(
                board,
                selected
            );

        case "n":
            return generateKnightMoves(
                board,
                selected
            );

        case "k":
            return generateKingMoves(
                board,
                selected,
                castleState
            );

        case "p":
            return generatePawnMoves(
                board,
                selected,
                pieceColor,
                enPassantState,
                moveCount
            );

        default:
            return [];
    }
};

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

const isSquareUnderAttack = (
    board,
    targetRow,
    targetCol,
    enemyColor
) => {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = board[row][col];

            if (piece === '') {
                continue;
            }

            const pieceColor =
                piece[0] === 'w'
                    ? 'white'
                    : 'black';

            if (pieceColor !== enemyColor) {
                continue;
            }

            const pieceType = piece[1];

            let possibleMoves = [];

            switch (pieceType) {

                case 'r':
                    possibleMoves =
                        generateRookMoves(
                            board,
                            [row, col]
                        );
                    break;

                case 'b':
                    possibleMoves =
                        generateBishopMoves(
                            board,
                            [row, col]
                        );
                    break;

                case 'q':
                    possibleMoves =
                        generateQueenMoves(
                            board,
                            [row, col]
                        );
                    break;

                case 'n':
                    possibleMoves =
                        generateKnightMoves(
                            board,
                            [row, col]
                        );
                    break;

                case 'k':
                    const kingDirections = [
                        [-1, -1],
                        [-1, 0],
                        [-1, 1],
                        [0, -1],
                        [0, 1],
                        [1, -1],
                        [1, 0],
                        [1, 1]
                    ];

                    possibleMoves = kingDirections.map(
                        ([rowOffset, colOffset]) => [
                            row + rowOffset,
                            col + colOffset
                        ]
                    );

                    break;

                case 'p':
                    const pawnDirection =
                        pieceColor === 'white'
                            ? -1
                            : 1;

                    possibleMoves = [
                        [row + pawnDirection, col - 1],
                        [row + pawnDirection, col + 1]
                    ];

                    break
            }

            const attacking =
                possibleMoves.some(
                    ([moveRow, moveCol]) =>
                        moveRow === targetRow &&
                        moveCol === targetCol
                );

            if (attacking) {
                return true;
            }
        }
    }

    return false;
};

const findPlayerKingPosition = (
    board,
    pieceColorCode
) => {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                board[row][col];

            if (
                piece !== '' &&
                piece[0] === pieceColorCode &&
                piece[1] === 'k'
            ) {

                return [row, col];
            }
        }
    }

    return null;
};

export const wouldKingBeInCheckAfterMove = (
    board,
    turn
) => {
    const pieceColorCode = turn === "white" ? "w" : "b";

    // Find king position
    const kingPosition =
        findPlayerKingPosition(
            board,
            pieceColorCode
        );

    if (!kingPosition) {
        return false;
    }

    const enemyColor =
        pieceColorCode === 'w'
            ? 'black'
            : 'white';

    // Check if king is attacked
    return isSquareUnderAttack(
        board,
        kingPosition[0],
        kingPosition[1],
        enemyColor
    );
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
    selected,
    castleState
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

    const enemyColor =
        movingPieceColor === 'white'
            ? 'black'
            : 'white';

    if (
        movingPieceColor === 'white' &&
        curRow === 7 &&
        curCol === 4 &&
        !castleState.whiteKingMoved
    ) {

        // =========================
        // KING SIDE
        // =========================

        if (
            !castleState.whiteRightRookMoved &&
            board[7][7] === 'wr' &&
            board[7][5] === '' &&
            board[7][6] === ''
        ) {

            const safe =
                !isSquareUnderAttack(
                    board,
                    7,
                    4,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    7,
                    5,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    7,
                    6,
                    enemyColor
                );

            if (safe) {
                possibleMoves.push([7, 6]);
            }
        }

        // =========================
        // QUEEN SIDE
        // =========================

        if (
            !castleState.whiteLeftRookMoved &&
            board[7][0] === 'wr' &&
            board[7][1] === '' &&
            board[7][2] === '' &&
            board[7][3] === ''
        ) {

            const safe =
                !isSquareUnderAttack(
                    board,
                    7,
                    4,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    7,
                    3,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    7,
                    2,
                    enemyColor
                );

            if (safe) {
                possibleMoves.push([7, 2]);
            }
        }
    }

    if (
        movingPieceColor === 'black' &&
        curRow === 0 &&
        curCol === 4 &&
        !castleState.blackKingMoved
    ) {

        // king side

        if (
            !castleState.blackRightRookMoved &&
            board[0][7] === 'br' &&
            board[0][5] === '' &&
            board[0][6] === ''
        ) {

            const safe =
                !isSquareUnderAttack(
                    board,
                    0,
                    4,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    0,
                    5,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    0,
                    6,
                    enemyColor
                );

            if (safe) {
                possibleMoves.push([0, 6]);
            }
        }

        // queen side

        if (
            !castleState.blackLeftRookMoved &&
            board[0][0] === 'br' &&
            board[0][1] === '' &&
            board[0][2] === '' &&
            board[0][3] === ''
        ) {

            const safe =
                !isSquareUnderAttack(
                    board,
                    0,
                    4,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    0,
                    3,
                    enemyColor
                ) &&
                !isSquareUnderAttack(
                    board,
                    0,
                    2,
                    enemyColor
                );

            if (safe) {
                possibleMoves.push([0, 2]);
            }
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

export const isCheckMate = (
    board,
    color,
    enPassantState,
    moveCount
) => {

    const pieceColorCode =
        color === "white"
            ? "w"
            : "b";

    const enemyColor =
        color === "white"
            ? "black"
            : "white";

    // Find king

    const kingPosition =
        findPlayerKingPosition(
            board,
            pieceColorCode
        );

    // King missing

    if (!kingPosition) {
        return false;
    }

    // Is king currently checked?

    const underAttack =
        isSquareUnderAttack(
            board,
            kingPosition[0],
            kingPosition[1],
            enemyColor
        );

    if (!underAttack) {
        return false;
    }

    // Disable castling

    const castleState = {
        whiteKingMoved: true,
        blackKingMoved: true,

        whiteLeftRookMoved: true,
        whiteRightRookMoved: true,

        blackLeftRookMoved: true,
        blackRightRookMoved: true
    };

    // Generate king moves

    const possibleMoves =
        generateKingMoves(
            board,
            kingPosition,
            castleState
        );

    // Test every king move

    for (const [row, col] of possibleMoves) {

        const boardClone =
            board.map(
                boardRow => [...boardRow]
            );

        // simulate king move

        boardClone[row][col] =
            boardClone[
            kingPosition[0]
            ][
            kingPosition[1]
            ];

        boardClone[
            kingPosition[0]
        ][
            kingPosition[1]
        ] = '';

        // if king survives

        if (
            !wouldKingBeInCheckAfterMove(
                boardClone,
                color
            )
        ) {

            return false;
        }
    }


    // Check if another piece can save the king

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];

            // friendly non-king piece

            if (
                piece !== '' &&
                piece[0] === pieceColorCode &&
                piece[1] !== 'k'
            ) {

                const selected = [row, col];

                let possibleMoves = [];

                const pieceType = piece[1];

                switch (pieceType) {

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

                    case 'p':
                        possibleMoves =
                            generatePawnMoves(
                                board,
                                selected,
                                color,
                                enPassantState,
                                moveCount
                            );
                        break;
                }

                // Try every move

                for (const [moveRow, moveCol] of possibleMoves) {

                    const boardClone =
                        board.map(
                            boardRow => [...boardRow]
                        );

                    // EN PASSANT CAPTURE

                    if (
                        pieceType === 'p' &&
                        moveCol !== col &&
                        board[moveRow][moveCol] === ''
                    ) {

                        const capturedPawnRow =
                            color === 'white'
                                ? moveRow + 1
                                : moveRow - 1;

                        boardClone[capturedPawnRow][moveCol] = '';
                    }

                    // simulate move

                    boardClone[moveRow][moveCol] =
                        piece;
                    boardClone[row][col] = '';

                    // if check removed

                    if (
                        !wouldKingBeInCheckAfterMove(
                            boardClone,
                            color
                        )
                    ) {

                        return false;
                    }
                }
            }
        }
    }

    return true;
};

const hasAnyLegalMove = (
    board,
    color,
    enPassantState,
    moveCount
) => {
    const pieceColorCode =
        color === "white" ? "w" : "b";

    const castleState = {
        whiteKingMoved: true,
        blackKingMoved: true,

        whiteLeftRookMoved: true,
        whiteRightRookMoved: true,

        blackLeftRookMoved: true,
        blackRightRookMoved: true
    };


    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (
                piece === '' ||
                piece[0] !== pieceColorCode
            ) {
                continue;
            }

            let moves = [];

            switch (piece[1]) {
                case "k":
                    moves = generateKingMoves(
                        board,
                        [row, col],
                        castleState
                    );
                    break;
                case "q":
                    moves = generateQueenMoves(
                        board,
                        [row, col]
                    );
                    break;
                case "r":
                    moves = generateRookMoves(
                        board,
                        [row, col]
                    );
                    break;
                case "b":
                    moves = generateBishopMoves(
                        board,
                        [row, col]
                    );
                    break;
                case "n":
                    moves = generateKnightMoves(
                        board,
                        [row, col]
                    );
                    break;
                case "p":
                    moves = generatePawnMoves(
                        board,
                        [row, col],
                        color,
                        enPassantState,
                        moveCount
                    );
                    break;
            }

            for (const [newRow, newCol] of moves) {
                const clone =
                    board.map(
                        r => [...r]
                    );

                clone[newRow][newCol] =
                    clone[row][col];

                clone[row][col] = "";

                if (
                    !wouldKingBeInCheckAfterMove(
                        clone,
                        color
                    )
                ) {

                    return true;
                }
            }
        }
    }
    return false;
};

const isMaterialInsufficient = (board) => {
    const whitePieces = [];
    const blackPieces = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];

            if (piece === "" || piece[1] === "k") continue;

            if (piece[0] === "w") {
                whitePieces.push(piece);
            } else {
                blackPieces.push(piece);
            }
        }
    }

    // King vs King
    if (
        whitePieces.length === 0 &&
        blackPieces.length === 0
    ) {
        return true;
    }

    // King + Bishop/Knight vs King
    if (
        whitePieces.length === 1 &&
        blackPieces.length === 0 &&
        ["b", "n"].includes(whitePieces[0][1])
    ) {
        return true;
    }

    if (
        blackPieces.length === 1 &&
        whitePieces.length === 0 &&
        ["b", "n"].includes(blackPieces[0][1])
    ) {
        return true;
    }

    // King + Bishop vs King + Bishop
    if (
        whitePieces.length === 1 &&
        blackPieces.length === 1 &&
        whitePieces[0][1] === "b" &&
        blackPieces[0][1] === "b"
    ) {
        return true;
    }

    return false;
};

export const isStaleMate = (
    board,
    color,
    enPassantState,
    moveCount
) => {
    // material insufficiency check 
    if (isMaterialInsufficient(board)) {
        return true;
    }

    const pieceColorCode =
        color === "white"
            ? "w"
            : "b";

    const king =
        findPlayerKingPosition(
            board,
            pieceColorCode
        );

    const enemy =
        color === "white"
            ? "black"
            : "white";

    // king is checked => checkmate, not stalemate
    if (
        isSquareUnderAttack(
            board,
            king[0],
            king[1],
            enemy
        )
    ) {
        return false;
    }

    // no legal moves => stalemate
    return !hasAnyLegalMove(
        board,
        color,
        enPassantState,
        moveCount
    );
};

export const isMoveValid = (
    board,
    selected,
    turn,
    row,
    col,
    enPassantState,
    castleState,
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
                    selected,
                    castleState
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