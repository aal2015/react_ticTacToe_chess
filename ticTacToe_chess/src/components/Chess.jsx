import { useState } from 'react';
import ChessBoard from './ChessBoard';

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
    const [turn, setTurn] = useState("white");
    const [selected, setSelected] = useState(null);

    const isMoveValid = (row, col) => {
        const pieceColor = board[selected[0]][selected[1]][0] === 'w' ? "white" : "black";
        const piece = board[selected[0]][selected[1]][1]
        console.log(pieceColor);
        console.log(piece);

        if (pieceColor !== turn) {
            return false;
        }

        return true;
    }

    const pieceSelect = (row, col) => {
        if (selected) {
            if (isMoveValid(row, col)) {
                let boardClone = [...board];
                boardClone[row][col] = boardClone[selected[0]][selected[1]];
                boardClone[selected[0]][selected[1]] = '';
                setBoard(boardClone);

                if (turn === "white") {
                    setTurn("black");
                } else if (turn === "black") {
                    setTurn("white");
                }
            }
            setSelected(null);
            return;
        }

        if (board[row][col] === '') {
            return;
        }
        setSelected([row, col]);
    }

    return (
        <>
            <p>{turn === "white" ? 'White Turn' : 'Black turn'}</p>
            <ChessBoard
                boardState={board}
                onPieceSelect={pieceSelect}
                activeSelect={selected}
            />
        </>
    );
}

export default Chess;