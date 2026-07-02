import { useState } from 'react';
import ChessBoard from './ChessBoard';
import ChessSideBar from './ChessSideBar';
import GameOverModal from './GameOverModal';
import { pieceNotation, generateMoveNotation } from './moveNotation';

import {
    isMoveValid,
    wouldKingBeInCheckAfterMove,
    isCheckMate,
    isStaleMate
} from './moveValidCheck';

import PromotionModal from './PawnPromotionModal';

const initBoard = [
    // ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    // ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    // ['', '', '', '', '', '', '', ''],
    // ['', '', '', '', '', '', '', ''],
    // ['', '', '', '', '', '', '', ''],
    // ['', '', '', '', '', '', '', ''],
    // ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    // ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],

    ['wk', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', 'bq'],
    ['', '', '', 'bk', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
];

const Chess = () => {

    const [board, setBoard] = useState(initBoard);

    const [castleState, setCastleState] = useState({
        whiteKingMoved: false,
        blackKingMoved: false,

        whiteLeftRookMoved: false,
        whiteRightRookMoved: false,

        blackLeftRookMoved: false,
        blackRightRookMoved: false
    });

    const [turn, setTurn] = useState("white");

    const [winner, setWinner] = useState(null);

    const [gameResult, setGameResult] = useState(null);

    const [selected, setSelected] = useState(null);

    const [moveCount, setMoveCount] = useState(0);

    const [enPassantState, setEnPassantState] = useState(null);

    const [playerColor, setPlayerColor] = useState("white");

    const [moveHistory, setMoveHistory] = useState([]);

    const resetGame = () => {
        console.log("Detected");

        setBoard(initBoard);

        setTurn("white");

        setSelected(null);

        setMoveCount(0);

        setEnPassantState(null);

        setMoveHistory([]);

        setCastleState({
            whiteKingMoved: false,
            blackKingMoved: false,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,

            blackLeftRookMoved: false,
            blackRightRookMoved: false
        });

        setGameResult(null);
    };

    const [showPromotionModal, setShowPromotionModal] =
        useState(false);

    const [promotionData, setPromotionData] =
        useState(null);

    const handlePromotion = (promotedPiece) => {

        const {
            boardClone,
            row,
            col,
            movingPiece,
            selected,
            newCastleState,
            nextEnPassantState,
            isCapture,
            isEnPassant
        } = promotionData;

        const colorCode =
            turn === 'white'
                ? 'w'
                : 'b';

        boardClone[row][col] =
            `${colorCode}${promotedPiece}`;

        const enemyColor =
            turn === 'white'
                ? 'black'
                : 'white';

        const checkState =
            wouldKingBeInCheckAfterMove(
                boardClone,
                enemyColor
            );

        const checkMateState =
            isCheckMate(
                boardClone,
                enemyColor,
                nextEnPassantState,
                moveCount + 1
            );

        // =========================
        // STALEMATE CHECK (PROMOTION)
        // =========================

        const stalemateState = isStaleMate(
            boardClone,
            enemyColor,
            nextEnPassantState,
            moveCount + 1
        );

        console.log(`DEBUG: checkMate=${checkMateState}, stalemate=${stalemateState}`);

        if (stalemateState) {
            console.log("Stalemate!");
            const notation = generateMoveNotation({
                movingPiece,
                selected,
                row,
                col,
                isCapture,
                isEnPassant,
                isCheck: checkState,
                isCheckMate: checkMateState,
                isStaleMate: stalemateState,
                isPromotion: true,
                promotedPiece
            });
            setMoveHistory(prev => {
                const updatedHistory = [...prev];
                if (turn === 'white') {
                    updatedHistory.push({
                        moveNumber:
                            Math.floor(moveCount / 2) + 1,
                        white: notation,
                        black: ''
                    });
                } else {
                    updatedHistory[
                        updatedHistory.length - 1
                    ].black = notation;
                }
                return updatedHistory;
            });
            setBoard(boardClone);
            setCastleState(newCastleState);
            setEnPassantState(nextEnPassantState);
            setWinner(null);
            return;
        }

        const notation =
            generateMoveNotation({
                movingPiece,
                selected,
                row,
                col,
                isCapture,
                isEnPassant,
                isCheck: checkState,
                isCheckMate: checkMateState,
                isStaleMate: stalemateState,
                isPromotion: true,
                promotedPiece
            });

        setMoveHistory(prev => {

            const updatedHistory = [...prev];

            if (turn === 'white') {

                updatedHistory.push({
                    moveNumber:
                        Math.floor(moveCount / 2) + 1,
                    white: notation,
                    black: ''
                });

            } else {

                updatedHistory[
                    updatedHistory.length - 1
                ].black = notation;
            }

            return updatedHistory;
        });

        setBoard(boardClone);

        setCastleState(newCastleState);

        setEnPassantState(
            nextEnPassantState
        );

        setShowPromotionModal(false);

        setPromotionData(null);

        setTurn(
            turn === 'white'
                ? 'black'
                : 'white'
        );

        setMoveCount(
            prev => prev + 1
        );
    };

    const getStatusText = () => {

        if (winner) {

            const winnerType =
                winner === playerColor
                    ? "You"
                    : "AI";

            return `${winner} wins! (${winnerType})`;
        }


        const turnType =
            turn === playerColor
                ? "you"
                : "AI";


        return `${turn}'s turn (${turnType})`;
    };

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
                // MOVE FLAGS
                // =========================

                let isCastleKingSide = false;

                let isCastleQueenSide = false;

                const isCapture =
                    board[row][col] !== '';

                const isEnPassant =
                    movingPiece[1] === 'p' &&
                    col !== selected[1] &&
                    board[row][col] === '';

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
                // CASTLING MOVEMENT
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

                    isCastleKingSide = true;
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

                    isCastleQueenSide = true;
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

                    isCastleKingSide = true;
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

                    isCastleQueenSide = true;
                }

                // =========================
                // EN PASSANT CAPTURE
                // =========================

                if (isEnPassant) {

                    const capturedPawnRow =
                        turn === 'white'
                            ? row + 1
                            : row - 1;

                    boardClone[capturedPawnRow][col] = '';
                }

                // =========================
                // MOVE PIECE
                // =========================

                boardClone[row][col] = movingPiece;

                boardClone[selected[0]][selected[1]] = '';

                // =========================
                // PAWN PROMOTION CHECK
                // =========================

                const isPromotion =
                    movingPiece[1] === 'p' &&
                    (
                        (movingPiece[0] === 'w' && row === 0) ||
                        (movingPiece[0] === 'b' && row === 7)
                    );

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
                }

                if (isPromotion) {
                    setPromotionData({
                        boardClone,
                        row,
                        col,
                        movingPiece,
                        selected,
                        newCastleState,
                        nextEnPassantState
                    });

                    setShowPromotionModal(true);
                    setSelected(null);

                    return;
                }

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
                // CHECK / CHECKMATE
                // =========================

                const enemyColor =
                    turn === 'white'
                        ? 'black'
                        : 'white';

                const checkState =
                    wouldKingBeInCheckAfterMove(
                        boardClone,
                        enemyColor
                    );

                const checkMateState =
                    isCheckMate(
                        boardClone,
                        enemyColor,
                        nextEnPassantState,
                        moveCount + 1
                    );

                if (checkMateState) {
                    setGameResult({
                        title: "Checkmate",
                        message: `${turn} wins!`
                    });
                }

                // =========================
                // STALEMATE CHECK
                // =========================

                const stalemateState = isStaleMate(
                    boardClone,
                    enemyColor,
                    nextEnPassantState,
                    moveCount + 1
                );

                console.log(`DEBUG: checkMate=${checkMateState}, stalemate=${stalemateState}`);

                if (stalemateState) {
                    console.log("Stalemate!");
                    const notation = generateMoveNotation({
                        movingPiece,
                        selected,
                        row,
                        col,
                        isCapture,
                        isCastleKingSide,
                        isCastleQueenSide,
                        isCheck: checkState,
                        isCheckMate: checkMateState,
                        isStaleMate: stalemateState,
                        isEnPassant
                    });
                    setMoveHistory((prev) => {
                        const updatedHistory = [...prev];
                        // white move
                        if (turn === 'white') {
                            updatedHistory.push({
                                moveNumber:
                                    Math.floor(moveCount / 2) + 1,
                                white: notation,
                                black: ''
                            });
                        } else {
                            // black move
                            updatedHistory[
                                updatedHistory.length - 1
                            ].black = notation;
                        }
                        return updatedHistory;
                    });
                    setBoard(boardClone);
                    setCastleState(newCastleState);
                    setEnPassantState(nextEnPassantState);
                    setWinner(null);
                    setSelected(null);
                    setGameResult({
                        title: "Stalemate",
                        message: "The game ends in a draw."
                    });
                    return;
                }

                // =========================
                // GENERATE NOTATION
                // =========================

                const notation =
                    generateMoveNotation({
                        movingPiece,
                        selected,
                        row,
                        col,
                        isCapture,
                        isCastleKingSide,
                        isCastleQueenSide,
                        isCheck: checkState,
                        isCheckMate: checkMateState,
                        isStaleMate: stalemateState,
                        isEnPassant
                    });

                // =========================
                // UPDATE MOVE HISTORY
                // =========================

                setMoveHistory((prev) => {

                    const updatedHistory = [...prev];

                    // white move

                    if (turn === 'white') {

                        updatedHistory.push({
                            moveNumber:
                                Math.floor(moveCount / 2) + 1,
                            white: notation,
                            black: ''
                        });

                    } else {

                        // black move

                        updatedHistory[
                            updatedHistory.length - 1
                        ].black = notation;
                    }

                    return updatedHistory;
                });

                // =========================
                // COMMIT STATE
                // =========================

                setBoard(boardClone);

                setCastleState(newCastleState);

                setEnPassantState(nextEnPassantState);



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

        // =========================
        // EMPTY SQUARE
        // =========================

        if (board[row][col] === '') {

            return;
        }

        // =========================
        // SELECT PIECE
        // =========================

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
                    className={`
                                    text-2xl
                                    font-bold
                                    ${(turn === 'white' || winner)
                            ? 'text-white'
                            : 'text-black'
                        }
                             `}
                >
                    {getStatusText()}
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
                <ChessSideBar
                    moveHistory={moveHistory}
                    onReset={resetGame}
                    playerColor={playerColor}
                    onColorChange={setPlayerColor}
                />
            </div>

            {showPromotionModal && (

                <PromotionModal
                    color={turn}
                    onSelect={handlePromotion}
                />

            )}

            <GameOverModal
                isOpen={gameResult !== null}
                title={gameResult?.title}
                message={gameResult?.message}
                onPlayAgain={resetGame}
            />

        </div>
    );
};

export default Chess;