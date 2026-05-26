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

const ChessBoard = ({
    boardState,
    onPieceSelect,
    activeSelect,
    playerColor
}) => {

    // =========================
    // DISPLAY -> REAL COORDS
    // =========================

    const getActualRow = (displayRow) => {

        return playerColor === 'white'
            ? displayRow
            : 7 - displayRow;
    };

    const getActualCol = (displayCol) => {

        return playerColor === 'white'
            ? displayCol
            : 7 - displayCol;
    };

    return (
        <div id="chessGameBoard">

            {[...Array(8)].map((_, displayRow) =>

                [...Array(8)].map((_, displayCol) => {

                    // =========================
                    // REAL BOARD COORDS
                    // =========================

                    const rowIndex =
                        getActualRow(displayRow);

                    const cellIndex =
                        getActualCol(displayCol);

                    const cell =
                        boardState[rowIndex][cellIndex];

                    // =========================
                    // BOARD COLORS
                    // =========================

                    const isWhiteSquare =
                        (displayRow + displayCol) % 2 === 0;

                    // =========================
                    // ACTIVE SELECTION
                    // =========================

                    const isSelected =
                        activeSelect &&
                        rowIndex === activeSelect[0] &&
                        cellIndex === activeSelect[1];

                    return (
                        <div
                            key={`${displayRow}-${displayCol}`}
                            className={`
                                square
                                ${isWhiteSquare
                                    ? 'whiteSquare'
                                    : 'darkBlue'}
                                ${isSelected
                                    ? 'activeSelect'
                                    : ''}
                            `}
                            onClick={() =>
                                onPieceSelect(
                                    rowIndex,
                                    cellIndex
                                )
                            }
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