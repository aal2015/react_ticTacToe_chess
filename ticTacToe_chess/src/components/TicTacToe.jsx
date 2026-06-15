import { useState } from 'react';
import Board from "./TicTacToeBoard";

const winPatterns = [
    [0,1,2],[0,3,6],[0,4,8],[1,4,7],
    [2,5,8],[2,4,6],[3,4,5],[6,7,8]
];

const checkWinner = (boardState) => {
    for (let [a,b,c] of winPatterns) {
        if (boardState[a] !== '' &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]) {
            return true;
        }
    }
    return false;
};

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
        if (checkWinner(newBoard)) {
            console.log(`Player ${turn} is winner`);
        }
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