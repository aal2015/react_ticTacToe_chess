import { useState } from 'react';
import ChessBoard from './ChessBoard';
import ChessSideBar from './ChessSideBar';
import GameOverModal from './GameOverModal';
import ResetGameModal from './GameResetModal';
import {
    isMoveValid,
    wouldKingBeInCheckAfterMove,
    isCheckMate,
    isStaleMate,
    handleCastleMove,
    handleEnPassant,
    processPlayerMove
} from './moveValidCheck';
import { handlePromotion } from './promotionLogic';
import PromotionModal from './PawnPromotionModal';

const initBoard = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
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

    const onClickResetButton = () => {
        const isStandardGame = JSON.stringify(initBoard) === JSON.stringify(board);
        if (!isStandardGame) {
            setShowResetModal(true);
        } else {
            resetGame();
        }
    }

    const [showPromotionModal, setShowPromotionModal] =
        useState(false);
    const [promotionData, setPromotionData] =
        useState(null);
    const [showResetModal, setShowResetModal] = useState(false);

    const closeGameOverModal = () => {
        setGameResult(null);
    };

    const confirmReset = () => {
        resetGame();
        setShowResetModal(false);
    };

    const cancelReset = () => {
        setShowResetModal(false);
    };

    const handlePromotionHelper = (promotedPiece) => {
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

        const {
            updatedBoardClone,
            updatedCastleState,
            updatedEnPassantState,
            updatedHistory,
            updatedMoveCount,
            checkMateState,
            stalemateState
        } = handlePromotion(
            boardClone,
            selected,
            movingPiece,
            row,
            col,
            isCapture,
            isEnPassant,
            turn,
            moveCount,
            castleState,
            nextEnPassantState,
            moveHistory,
            promotedPiece)

        setBoard(updatedBoardClone);
        setCastleState(updatedCastleState);
        setEnPassantState(updatedEnPassantState);
        setShowPromotionModal(false);
        setMoveHistory(updatedHistory);
        setPromotionData(null);
        setTurn(
            turn === 'white'
                ? 'black'
                : 'white'
        );
        setMoveCount(updatedMoveCount);
        if (checkMateState) {
            setGameResult({
                title: "Checkmate",
                message: `${turn} wins!`
            });
        } else if (stalemateState) {
            setGameResult({
                title: "Stalemate",
                message: "The game ends in a draw."
            });
        }
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
            const result = processPlayerMove({
                board,
                selected,
                target: [row, col],
                turn,
                castleState,
                enPassantState,
                moveCount
            });

            if (!result.validMove) {
                setSelected(null);
                return;
            }

            // =========================
            // PAWN PROMOTION
            // =========================

            if (result.move.isPromotion) {
                setPromotionData({
                    boardClone: result.board.board,
                    row: result.move.to[0],
                    col: result.move.to[1],
                    movingPiece: result.move.movingPiece,
                    selected: result.move.from,
                    newCastleState: result.board.castleState,
                    nextEnPassantState: result.board.enPassantState
                });
                setShowPromotionModal(true);
                setSelected(null);
                return;
            }

            // =========================
            // GAME RESULT
            // =========================

            if (result.game.checkmate) {
                setGameResult({
                    title: "Checkmate",
                    message: `${turn} wins!`
                });
            }

            if (result.game.stalemate) {
                setGameResult({
                    title: "Stalemate",
                    message: "The game ends in a draw."
                });
            }

            // =========================
            // MOVE HISTORY
            // =========================

            setMoveHistory(prev => {
                const history = [...prev];
                if (turn === "white") {
                    history.push({
                        moveNumber:
                            Math.floor(moveCount / 2) + 1,
                        white: result.notation,
                        black: ""
                    });
                } else {
                    history[history.length - 1].black = result.notation;
                }
                return history;
            });

            // =========================
            // UPDATE BOARD
            // =========================

            setBoard(result.board.board);
            setCastleState(
                result.board.castleState
            );
            setEnPassantState(
                result.board.enPassantState
            );

            // =========================
            // NEXT TURN
            // =========================

            setTurn(
                turn === "white"
                    ? "black"
                    : "white"
            );
            setMoveCount(moveCount + 1);
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
                    onReset={onClickResetButton}
                    playerColor={playerColor}
                    onColorChange={setPlayerColor}
                />
            </div>

            {showPromotionModal && (

                <PromotionModal
                    color={turn}
                    onSelect={handlePromotionHelper}
                />

            )}

            <GameOverModal
                isOpen={gameResult !== null}
                title={gameResult?.title}
                message={gameResult?.message}
                onPlayAgain={resetGame}
                onClose={closeGameOverModal}
            />
            <ResetGameModal
                isOpen={showResetModal}
                onConfirm={confirmReset}
                onCancel={cancelReset}
            />
        </div>
    );
};

export default Chess;