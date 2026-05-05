import './ChessBoard.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faChessPawn,
    faChessRook,
    faChessKnight,
    faChessBishop,
    faChessQueen,
    faChessKing
} from '@fortawesome/free-solid-svg-icons';

const pieceIcons = {
    wp: faChessPawn,
    wr: faChessRook,
    wn: faChessKnight,
    wb: faChessBishop,
    wq: faChessQueen,
    wk: faChessKing,

    bp: faChessPawn,
    br: faChessRook,
    bn: faChessKnight,
    bb: faChessBishop,
    bq: faChessQueen,
    bk: faChessKing
};

const ChessBoard = ({ boardState, onPieceSelect }) => {
    return (
        <div id="chessGameBoard">
            {boardState.map((row, rowIndex) =>
                row.map((cell, cellIndex) => {
                    const isWhiteSquare =
                        (rowIndex + cellIndex) % 2 === 0;

                    return (
                        <div
                            key={`${rowIndex}-${cellIndex}`}
                            className={`square ${
                                isWhiteSquare
                                    ? 'whiteSquare'
                                    : 'darkBlue'
                            }`}

                            onClick={cell ? onPieceSelect: null}
                        >
                            {cell && (
                                <FontAwesomeIcon
                                    icon={pieceIcons[cell]}
                                    className={
                                        cell.startsWith('b')
                                            ? 'blackPiece'
                                            : 'whitePiece'
                                    }
                                />
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ChessBoard;