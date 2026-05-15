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

                const movingPiece =
                    board[selected[0]][selected[1]];

                // =========================
                // UPDATE CASTLING STATE
                // =========================

                if (movingPiece === 'wk' && !castleState["whiteKingMoved"]) {

                    setCastleState(prev => ({
                        ...prev,
                        whiteKingMoved: true
                    }));
                }

                if (movingPiece === 'bk' && !castleState["blackKingMoved"]) {

                    setCastleState(prev => ({
                        ...prev,
                        blackKingMoved: true
                    }));
                }

                // white rooks

                if (
                    movingPiece === 'wr' &&
                    selected[0] === 7 &&
                    selected[1] === 0
                ) {

                    setCastleState(prev => ({
                        ...prev,
                        whiteLeftRookMoved: true
                    }));
                }

                if (
                    movingPiece === 'wr' &&
                    selected[0] === 7 &&
                    selected[1] === 7
                ) {

                    setCastleState(prev => ({
                        ...prev,
                        whiteRightRookMoved: true
                    }));
                }

                // black rooks

                if (
                    movingPiece === 'br' &&
                    selected[0] === 0 &&
                    selected[1] === 0
                ) {

                    setCastleState(prev => ({
                        ...prev,
                        blackLeftRookMoved: true
                    }));
                }

                if (
                    movingPiece === 'br' &&
                    selected[0] === 0 &&
                    selected[1] === 7
                ) {

                    setCastleState(prev => ({
                        ...prev,
                        blackRightRookMoved: true
                    }));
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