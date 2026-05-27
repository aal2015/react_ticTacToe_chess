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

    // =========================
    // BOARD LABELS
    // =========================

    const files =
        playerColor === 'white'
            ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
            : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

    const ranks =
        playerColor === 'white'
            ? [8, 7, 6, 5, 4, 3, 2, 1]
            : [1, 2, 3, 4, 5, 6, 7, 8];

    return (

        <div className="flex flex-col items-center">

            {/* =========================
                BOARD + RANK LABELS
            ========================= */}

            <div className="flex">

                {/* =========================
                    RANK LABELS
                ========================= */}

                <div className="flex flex-col">

                    {ranks.map((rank) => (

                        <div
                            key={rank}
                            className="
                                h-[60px]
                                w-[30px]
                                flex
                                items-center
                                justify-center
                                text-2xl
                                font-bold
                                text-white
                            "
                        >
                            {rank}
                        </div>

                    ))}

                </div>

                {/* =========================
                    CHESS BOARD
                ========================= */}

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

            </div>

            {/* =========================
                FILE LABELS
            ========================= */}

            <div className="flex ml-[30px]">

                {files.map((file) => (

                    <div
                        key={file}
                        className="
                            w-[60px]
                            h-[30px]
                            flex
                            items-center
                            justify-center
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
                        {file}
                    </div>

                ))}

            </div>

        </div>
    );
};

export default ChessBoard;