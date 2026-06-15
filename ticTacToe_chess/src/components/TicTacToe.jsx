import { useState } from 'react';
import Board from "./TicTacToeBoard";

const TicTacToe = () => {
    const initialBoard = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    const [board, setBoard] = useState(initialBoard);
    const [turn, setTurn] = useState("X");


    const handleSquareClick = (index) => {

        // Check if already filled
        if (board[index] !== '') {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = turn;
        setBoard(newBoard);
        setTurn(turn === "X" ? "O" : "X");
    };


    const resetGame = () => {
        setBoard(initialBoard);
        setTurn("X");
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