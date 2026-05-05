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

    const pieceSelect = () => {
        console.log("Select!");
    }
    
    return (
        <>
            <p>Chess component</p>
            <ChessBoard boardState={board} onPieceSelect={pieceSelect} />
        </>
    );
}

export default Chess;