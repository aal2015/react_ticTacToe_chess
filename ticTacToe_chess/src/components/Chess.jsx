import { useState, useEffect } from 'react';
import BackButton from './BackButton';
import ChessBoard from './ChessBoard';
import ChessSideBar from './ChessSideBar';
import GameOverModal from './GameOverModal';
import ResetGameModal from './GameResetModal';
import { processPlayerMove, generateMovesForPiece } from './moveValidCheck';
import { handlePromotion } from './promotionLogic';
import PromotionModal from './PawnPromotionModal';
import { initBoard, getStatusInfo, initCastleState } from './chessUtil';
import { ChessMinMaxAlgo } from './ChessAI';

const Chess = () => {
    const [board, setBoard] = useState(initBoard);
    const [castleState, setCastleState] = useState(initCastleState);
    const [turn, setTurn] = useState("white");
    const [winner, setWinner] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [selected, setSelected] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [moveCount, setMoveCount] = useState(0);
    const [enPassantState, setEnPassantState] = useState(null);
    const [lastMove, setLastMove] = useState(null);
    const [playerColor, setPlayerColor] = useState("white");
    const [moveHistory, setMoveHistory] = useState([]);

    const resetGame = () => {
        setBoard(initBoard);
        setTurn("white");
        setSelected(null);
        setMoveCount(0);
        setEnPassantState(null);
        setMoveHistory([]);
        setCastleState(initCastleState);
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

    const updateGameResult = (checkMateState, stalemateState) => {
        if (checkMateState) {
            setGameResult({
                title: "Checkmate",
                message: `${turn} wins!`,
                winner: turn
            });
            setWinner(turn);
        } else if (stalemateState) {
            setGameResult({
                title: "Stalemate",
                message: "The game ends in a draw."
            });
        }
    }

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
        updateGameResult(checkMateState, stalemateState);
    };

    const executeMove = (selected, target) => {
        const result = processPlayerMove({
            board,
            selected,
            target,
            turn,
            castleState,
            enPassantState,
            moveCount
        });

        if (!result.validMove) {
            return false;
        }

        // PAWN PROMOTION
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

        // GAME RESULT
        updateGameResult(result.game.checkmate, result.game.stalemate);

        // MOVE HISTORY
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

        // UPDATE BOARD
        setBoard(result.board.board);
        setCastleState(
            result.board.castleState
        );
        setEnPassantState(
            result.board.enPassantState
        );

        // LAST MOVE HIGHLIGHT
        setLastMove({
            from: selected,
            to: target
        });

        // NEXT TURN
        setTurn(
            turn === "white"
                ? "black"
                : "white"
        );
        setMoveCount(moveCount + 1);
        setSelected(null);
        setPossibleMoves([]); // Clear possible moves after move completes
        return true;
    }

    const pieceSelect = (row, col) => {
        if (selected) {
            if (!executeMove(selected, [row, col])) {
                setSelected(null);
                setPossibleMoves([]); // Clear possible moves when deselecting
            }

            return;
        }

        // EMPTY SQUARE
        if (board[row][col] === '') {
            return;
        }

        // SELECT PIECE - Calculate and store possible moves
        const piece = board[row][col];
        const pieceColor = piece[0] === 'w' ? 'white' : 'black';

        setSelected([row, col]);
        setPossibleMoves(generateMovesForPiece(
            board,
            piece,
            row,
            col,
            pieceColor,
            castleState,
            enPassantState,
            moveCount
        ));
    };

    const status = getStatusInfo(
        turn,
        gameResult,
        playerColor
    );

    const makeAIMove = () => {
        const algo = new ChessMinMaxAlgo();

        const result = algo.minMax(
            board,
            turn,
            enPassantState,
            castleState,
            moveCount,
            0,
            5,
            -Infinity,
            Infinity
        );

        executeMove(result.move.from, result.move.to);
    };

    useEffect(() => {
        if (turn !== playerColor) {
            const id = setTimeout(makeAIMove, 0);
            return () => clearTimeout(id);
        }
    }, [
        board,
        turn,
        castleState,
        enPassantState,
        moveCount,
        playerColor
    ]);

    return (<>
        <BackButton />
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

                <div className="flex items-center gap-2 text-2xl font-bold">
                    <p className="text-white">
                        Turn:
                    </p>

                    <div
                        className={`
                                    w-26
                                    px-4
                                    py-1
                                    rounded-md
                                    border
                                    font-bold
                                    ${turn === "white"
                                                        ? "bg-white text-black border-gray-300"
                                                        : "bg-black text-white border-gray-600"}
                                `}
                    >
                        {turn}
                    </div>
                </div>

                <ChessBoard
                    boardState={board}
                    onPieceSelect={pieceSelect}
                    activeSelect={selected}
                    lastMove={lastMove}
                    playerColor={playerColor}
                    possibleMoves={possibleMoves}
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
    </>);
};

export default Chess;