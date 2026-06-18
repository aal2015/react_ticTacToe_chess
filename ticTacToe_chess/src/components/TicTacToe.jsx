import { useState } from 'react';
import Board from "./TicTacToeBoard";
import { checkWinner, aiPlayMove } from './TicTacToeAi';

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
            console.log(`AI ${mark} wins`);
            disableGame();
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
            console.log(`Player ${playerMark} wins`);
            disableGame();
            return;
        }


        // AI move
        makeAiMove(playerBoard, aiMark);
    };


    const resetGame = () => {

        setBoard(initialBoard);

        enableGame();


        // If human is O, AI(X) starts again
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

            </div>
        </>
    );
}

export default TicTacToe;