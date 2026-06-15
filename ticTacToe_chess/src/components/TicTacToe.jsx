import { useState } from 'react';
import Board from "./TicTacToeBoard";

const TicTacToe = () => {
    const [board, setBoard] = useState([
        '', '', '',
        '', '', '',
        '', '', ''
    ]);

    const handleSquareClick = (index) => {

        // Check if already filled
        if (board[index] !== '') {
            return;
        }

        // Create a copy
        const newBoard = [...board];

        // Add current player's mark
        newBoard[index] = turn;

        // Update board
        setBoard(newBoard);

        // Switch turn
        setTurn(turn === "X" ? "O" : "X");
    };

    const [turn, setTurn] =
        useState("X");

    return (
        <>
            <p>Tic Tac Toe</p>
            <Board
                boardState={board}
                onSquareClick={handleSquareClick}
            />
        </>
    );
}

export default TicTacToe;