import { useState } from 'react';
import Board from "./TicTacToeBoard";
import {
    checkWinner, aiPlayMove, checkDraw
} from './TicTacToeAi';

const TicTacToe = () => {

    const initialBoard = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    const [board, setBoard] = useState(initialBoard);
    const [gameActive, setGameActive] = useState(true);

    const [playerMark, setPlayerMark] = useState("X");
    const aiMark = playerMark === "X" ? "O" : "X";
    const [winnerMessage, setWinnerMessage] = useState("");

    const enableGame = () => {
        setGameActive(true);
    };


    const disableGame = () => {
        setGameActive(false);
    };


    const makeAiMove = (currentBoard, mark) => {
        const aiBoard = aiPlayMove(
            [...currentBoard],
            mark
        );
        setBoard(aiBoard);

        if (checkWinner(aiBoard)) {
            setWinnerMessage(`AI ${mark} wins! Play again?`);
            disableGame();
            return;
        }

        if (checkDraw(aiBoard)) {
            setWinnerMessage("Draw! Play again?");
            disableGame();
            return;
        }
    };


    const togglePlayer = () => {

        const newPlayerMark = playerMark === "X" ? "O" : "X";

        setPlayerMark(newPlayerMark);

        setBoard(initialBoard);
        enableGame();


        // AI is X, so AI starts
        if (newPlayerMark === "O") {
            makeAiMove(initialBoard, "X");
        }
    };


    const handleSquareClick = (index) => {
        if (!gameActive) return;
        if (board[index] !== '') return;

        // Human move
        const playerBoard = [...board];
        playerBoard[index] = playerMark;
        setBoard(playerBoard);


        if (checkWinner(playerBoard)) {
            setWinnerMessage(`Player ${playerMark} wins! Play again?`);
            disableGame();
            return;
        }

        if (checkDraw(playerBoard)) {
            setWinnerMessage("Draw! Play again?");
            disableGame();
            return;
        }

        // AI move
        makeAiMove(playerBoard, aiMark);
    };


    const resetGame = () => {
        setBoard(initialBoard);
        setWinnerMessage("");
        enableGame();

        if (playerMark === "O") {
            makeAiMove(initialBoard, "X");
        }
    };


    return (
        <>
            <div className="flex flex-col items-center gap-4">

                <p className='text-3xl text-white font-bold'>
                    Tic Tac Toe
                </p>


                <button
                    onClick={togglePlayer}
                    className="
                        px-4
                        py-2
                        rounded-lg
                        border
                        border-white/30
                        text-white
                        hover:bg-white/10
                    "
                >
                    Play as: {playerMark}
                </button>


                <Board
                    boardState={board}
                    onSquareClick={handleSquareClick}
                />


                <button
                    onClick={resetGame}
                    className="
                        px-4
                        py-2
                        rounded-lg
                        border
                        border-white/30
                        text-white
                        hover:bg-white/10
                    "
                >
                    Reset
                </button>


                {winnerMessage && (
                    <p className="text-xl text-white font-bold">
                        {winnerMessage}
                    </p>
                )}
            </div>
        </>
    );
}

export default TicTacToe;