import { useState } from 'react';
import ChessBoard from './ChessBoard';

import {
    isMoveValid
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

    const [turn, setTurn] =
        useState("white");

    const [selected, setSelected] =
        useState(null);

    const [moveCount, setMoveCount] =
        useState(0);

    const [enPassantState, setEnPassantState] =
        useState(null);

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
                    moveCount
                );

            if (validMove) {

                const boardClone =
                    board.map(
                        (boardRow) => [...boardRow]
                    );

                const movingPiece =
                    board[selected[0]][selected[1]];

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

                setBoard(boardClone);

                // =========================
                // EN PASSANT ENABLE
                // =========================

                if (
                    movingPiece[1] === 'p' &&
                    Math.abs(row - selected[0]) === 2
                ) {

                    setEnPassantState({
                        row,
                        col,
                        pieceColor: turn,
                        moveCount
                    });

                } else {

                    setEnPassantState(null);
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
        <>
            <p>
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
            />
        </>
    );
};

export default Chess;