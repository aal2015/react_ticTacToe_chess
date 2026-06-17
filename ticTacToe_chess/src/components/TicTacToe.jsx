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
    const [turn, setTurn] = useState("X");
    const [gameActive, setGameActive] = useState(true);

    const enableGame = () => {
        setGameActive(true);
    };

    const disableGame = () => {
        setGameActive(false);
    };

    // const handleSquareClick = (index) => {
    //     // Stop clicking if game is over
    //     if (!gameActive) {
    //         return;
    //     }

    //     // Check if already filled
    //     if (board[index] !== '') {
    //         return;
    //     }

    //     const newBoard = [...board];
    //     newBoard[index] = turn;
    //     setBoard(newBoard);

    //     if (checkWinner(newBoard)) {
    //         console.log(`Player ${turn} is winner`);
    //         disableGame();
    //         return;
    //     }

    //     setTurn(turn === "X" ? "O" : "X");
    // };

    const handleSquareClick = (index) => {
        if (!gameActive) {
            return;
        }

        if (board[index] !== '') {
            return;
        }

        // Human move
        const playerBoard = [...board];
        playerBoard[index] = "X";
        setBoard(playerBoard);

        if (checkWinner(playerBoard)) {
            console.log("Player X wins");
            disableGame();
            return;
        }

        // AI move
        const aiBoard = aiPlayMove([...playerBoard], "O");
        setBoard(aiBoard);

        if (checkWinner(aiBoard)) {
            console.log("AI O wins");
            disableGame();
            return;
        }
    };


    const resetGame = () => {
        setBoard(initialBoard);
        setTurn("X");
        enableGame();
    };

    return (
        <>
            <div className="flex flex-col items-center gap-4">

                <p className='text-3xl text-white font-bold'>
                    Tic Tac Toe
                </p>

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