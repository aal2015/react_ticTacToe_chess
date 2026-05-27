import { useState } from 'react';
import ChessBoard from './ChessBoard';

import {
    isMoveValid,
    wouldKingBeInCheckAfterMove,
    isCheckMate
} from './moveValidCheck';

const Chess = () => {

    const [board, setBoard] = useState([
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
    ]);

    const [castleState, setCastleState] = useState({
        whiteKingMoved: false,
        blackKingMoved: false,

        whiteLeftRookMoved: false,
        whiteRightRookMoved: false,

        blackLeftRookMoved: false,
        blackRightRookMoved: false
    });

    const [turn, setTurn] =
        useState("white");

    const [selected, setSelected] =
        useState(null);

    const [moveCount, setMoveCount] =
        useState(0);

    const [enPassantState, setEnPassantState] =
        useState(null);

    const [playerColor, setPlayerColor] =
        useState("white");

    const pieceSelect = (row, col) => {

        if (selected) {

            const validMove =
                isMoveValid(
                    board,
                    selected,
                    turn,
                    row,
                    col,
                    enPassantState,
                    castleState,
                    moveCount
                );

            if (validMove) {

                const boardClone =
                    board.map(
                        (boardRow) => [...boardRow]
                    );

                // =========================
                // CLONE CASTLE STATE
                // =========================

                const newCastleState = {
                    ...castleState
                };

                const movingPiece =
                    board[selected[0]][selected[1]];

                // =========================
                // UPDATE CASTLING STATE
                // =========================

                if (movingPiece === 'wk') {
                    newCastleState.whiteKingMoved = true;
                }

                if (movingPiece === 'bk') {
                    newCastleState.blackKingMoved = true;
                }

                // white rooks

                if (
                    movingPiece === 'wr' &&
                    selected[0] === 7 &&
                    selected[1] === 0
                ) {

                    newCastleState.whiteLeftRookMoved = true;
                }

                if (
                    movingPiece === 'wr' &&
                    selected[0] === 7 &&
                    selected[1] === 7
                ) {

                    newCastleState.whiteRightRookMoved = true;
                }

                // black rooks

                if (
                    movingPiece === 'br' &&
                    selected[0] === 0 &&
                    selected[1] === 0
                ) {

                    newCastleState.blackLeftRookMoved = true;
                }

                if (
                    movingPiece === 'br' &&
                    selected[0] === 0 &&
                    selected[1] === 7
                ) {

                    newCastleState.blackRightRookMoved = true;
                }

                // =========================
                // CASTLING ROOK MOVEMENT
                // =========================

                // white king side

                if (
                    movingPiece === 'wk' &&
                    selected[0] === 7 &&
                    selected[1] === 4 &&
                    row === 7 &&
                    col === 6
                ) {

                    boardClone[7][5] = 'wr';
                    boardClone[7][7] = '';
                }

                // white queen side

                if (
                    movingPiece === 'wk' &&
                    selected[0] === 7 &&
                    selected[1] === 4 &&
                    row === 7 &&
                    col === 2
                ) {

                    boardClone[7][3] = 'wr';
                    boardClone[7][0] = '';
                }

                // black king side

                if (
                    movingPiece === 'bk' &&
                    selected[0] === 0 &&
                    selected[1] === 4 &&
                    row === 0 &&
                    col === 6
                ) {

                    boardClone[0][5] = 'br';
                    boardClone[0][7] = '';
                }

                // black queen side

                if (
                    movingPiece === 'bk' &&
                    selected[0] === 0 &&
                    selected[1] === 4 &&
                    row === 0 &&
                    col === 2
                ) {

                    boardClone[0][3] = 'br';
                    boardClone[0][0] = '';
                }

                // =========================
                // EN PASSANT CAPTURE
                // =========================

                if (
                    movingPiece[1] === 'p' &&
                    col !== selected[1] &&
                    board[row][col] === ''
                ) {

                    const capturedPawnRow =
                        turn === 'white'
                            ? row + 1
                            : row - 1;

                    boardClone[capturedPawnRow][col] = '';
                }

                // =========================
                // MOVE PIECE
                // =========================

                boardClone[row][col] =
                    movingPiece;

                boardClone[selected[0]][selected[1]] =
                    '';

                // =========================
                // KING SAFETY CHECK
                // =========================

                if (
                    wouldKingBeInCheckAfterMove(
                        boardClone,
                        turn
                    )
                ) {

                    setSelected(null);
                    return;
                }

                // =========================
                // COMMIT STATE
                // =========================

                setBoard(boardClone);

                setCastleState(newCastleState);

                // =========================
                // EN PASSANT ENABLE
                // =========================

                let nextEnPassantState = null;

                if (
                    movingPiece[1] === 'p' &&
                    Math.abs(row - selected[0]) === 2
                ) {
                    nextEnPassantState = {
                        row,
                        col,
                        pieceColor: turn,
                        moveCount
                    };
                    // setEnPassantState({
                    //     row,
                    //     col,
                    //     pieceColor: turn,
                    //     moveCount
                    // });

                } else {
                    nextEnPassantState = null;
                    // setEnPassantState(null);
                }

                setEnPassantState(nextEnPassantState);
                // =========================
                // Check if Checkmate
                // =========================
                const enemyColor = turn === "white" ? "black" : "white";
                if (isCheckMate(boardClone, enemyColor, nextEnPassantState, moveCount + 1)) {
                    console.log("Checkmate!!");
                }

                // =========================
                // NEXT TURN
                // =========================

                setTurn(
                    turn === 'white'
                        ? 'black'
                        : 'white'
                );

                setMoveCount(moveCount + 1);
            }

            setSelected(null);

            return;
        }

        if (board[row][col] === '') {
            return;
        }

        setSelected([row, col]);
    };

    return (
        <div
            className="
            max-w-7xl
            mx-auto
            p-4
            grid
            grid-cols-1
            lg:grid-cols-[1fr_320px]
            gap-6
            items-start
        "
        >

            {/* =========================
            LEFT SIDE
        ========================= */}

            <div
                className="
                flex
                flex-col
                items-center
                gap-4
            "
            >

                <p
                    className="
                    text-2xl
                    font-bold
                "
                >
                    {
                        turn === 'white'
                            ? 'White Turn'
                            : 'Black Turn'
                    }
                </p>

                <ChessBoard
                    boardState={board}
                    onPieceSelect={pieceSelect}
                    activeSelect={selected}
                    playerColor={playerColor}
                />

            </div>

            {/* =========================
            RIGHT SIDE
        ========================= */}

            <div
                className="
                flex
                flex-col
                gap-5
                lg:sticky
                lg:top-5
            "
            >

                {/* MOVE HISTORY */}

                <div
                    className="
                    bg-slate-800
                    text-white
                    rounded-xl
                    p-4
                    shadow-lg
                "
                >

                    <h2
                        className="
                        text-xl
                        font-bold
                        mb-3
                    "
                    >
                        Move History
                    </h2>

                    <div
                        className="
                        flex
                        flex-col
                        gap-2
                        max-h-[300px]
                        overflow-y-auto
                    "
                    >
                        <p>1. e4</p>
                        <p>1... e5</p>
                        <p>2. Nf3</p>
                    </div>

                </div>

                {/* CAPTURED PIECES */}

                <div
                    className="
                    bg-slate-800
                    text-white
                    rounded-xl
                    p-4
                    shadow-lg
                "
                >

                    <h2
                        className="
                        text-xl
                        font-bold
                        mb-3
                    "
                    >
                        Captured Pieces
                    </h2>

                    <div
                        className="
                        flex
                        flex-wrap
                        gap-2
                    "
                    >
                        <span>♟</span>
                        <span>♞</span>
                        <span>♝</span>
                    </div>

                </div>

                {/* BUTTONS */}

                <div
                    className="
                    bg-slate-800
                    text-white
                    rounded-xl
                    p-4
                    shadow-lg
                    flex
                    flex-col
                    gap-3
                "
                >

                    <button
                        className="
                        bg-blue-600
                        hover:bg-blue-700
                        transition
                        rounded-lg
                        py-3
                        font-semibold
                    "
                    >
                        Play Again
                    </button>

                    <button
                        className="
                        bg-red-600
                        hover:bg-red-700
                        transition
                        rounded-lg
                        py-3
                        font-semibold
                    "
                    >
                        Reset
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Chess;