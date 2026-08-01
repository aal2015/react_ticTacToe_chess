import './ChessBoard.css';
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChessPawn,
    faChessRook,
    faChessKnight,
    faChessBishop,
    faChessQueen,
    faChessKing
} from '@fortawesome/free-solid-svg-icons';
import {
    calculateMaterialScore, getCapturedPieces, pieceNotation
} from './chessUtil';


const renderCapturedPieces = (pieces, color) => {
    return pieces.map((piece, idx) => {
        const pieceCode = color + piece;

        return (
            <FontAwesomeIcon
                key={idx}
                icon={pieceIcons[pieceCode]}
                className={`
                    capturedPiece
                    ${color === 'b'
                        ? 'blackPiece'
                        : 'whitePiece'}
                `}
            />
        );
    });
};

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
    lastMove,
    possibleMoves,
    playerColor
}) => {

    // DISPLAY -> REAL COORDS
    const getActualRow = (displayRow) => {
        return playerColor === 'white' ? displayRow : 7 - displayRow;
    };

    const getActualCol = (displayCol) => {
        return playerColor === 'white' ? displayCol : 7 - displayCol;
    };

    // BOARD LABELS
    const files =
        playerColor === 'white'
            ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
            : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

    const ranks =
        playerColor === 'white'
            ? [8, 7, 6, 5, 4, 3, 2, 1]
            : [1, 2, 3, 4, 5, 6, 7, 8];

    const materialScore = calculateMaterialScore(boardState);
    const materialAdvantage = materialScore['difference'];
    const capturedData = useMemo(() => getCapturedPieces(boardState), [boardState]);

    const topCapturedPieces =
        playerColor === "white"
            ? capturedData.w
            : capturedData.b;

    const bottomCapturedPieces =
        playerColor === "white"
            ? capturedData.b
            : capturedData.w;

    return (
        <>
            <div className="flex flex-col items-center">

                {/* BOARD + RANK LABELS */}
                <div className="flex">
                    {/* RANK LABELS */}
                    <div className="flex flex-col">
                        {ranks.map((rank) => (
                            <div
                                key={rank}
                                className="
                                w-6 md:w-[30px]
                                h-10 md:h-[60px]
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

                    {/* CHESS BOARD */}
                    <div id="chessGameBoard">
                        {[...Array(8)].map((_, displayRow) =>
                            [...Array(8)].map((_, displayCol) => {
                                // REAL BOARD COORDS
                                const rowIndex = getActualRow(displayRow);
                                const cellIndex = getActualCol(displayCol);
                                const cell = boardState[rowIndex][cellIndex];

                                // BOARD COLORS
                                const isWhiteSquare =
                                    (displayRow + displayCol) % 2 === 0;

                                // ACTIVE SELECTION
                                const isSelected =
                                    activeSelect &&
                                    rowIndex === activeSelect[0] &&
                                    cellIndex === activeSelect[1];

                                // LAST MOVE HIGHLIGHT
                                const isLastMove =
                                    lastMove &&
                                    (
                                        (rowIndex === lastMove.from[0] &&
                                            cellIndex === lastMove.from[1]) ||

                                        (rowIndex === lastMove.to[0] &&
                                            cellIndex === lastMove.to[1])
                                    );

                                // POSSIBLE MOVE HIGHLIGHT
                                const isPossibleMove =
                                    possibleMoves &&
                                    possibleMoves.some(
                                        ([r, c]) => r === rowIndex && c === cellIndex
                                    );

                                const isCaptureMove =
                                    isPossibleMove &&
                                    cell &&
                                    cell[0] !== (playerColor === "white" ? "w" : "b");

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
                                        ${isLastMove
                                                ? 'lastMoveHighlight'
                                                : ''}
                                        ${isCaptureMove
                                                ? 'captureHighlight'
                                                : ''}
                                    `}
                                        onClick={() =>
                                            onPieceSelect(
                                                rowIndex,
                                                cellIndex
                                            )
                                        }
                                    >
                                        {/* Possible move dot - rendered on top of everything */}
                                        {isPossibleMove && (
                                            <div className="possibleMoveDot"></div>
                                        )}

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

                {/*  FILELABELS */}
                <div className="flex ml-[30px]">
                    {files.map((file) => (
                        <div
                            key={file}
                            className="
                            w-10 md:w-[60px]
                            h-6 md:h-[30px]
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


            <div className="w-full max-w-[480px] mt-2">

                <table className="w-full text-white text-center border-collapse">

                    <thead>
                        <tr className="border-b border-white/30">
                            <th className="text-left py-2"></th>
                            <th className="py-2">White</th>
                            <th className="py-2">Black</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr className="border-b border-white/10">
                            <td className="text-left py-2 font-semibold">
                                Captured
                            </td>

                            <td className="py-2">
                                <div className="flex flex-wrap justify-center gap-1">
                                    {renderCapturedPieces(capturedData.b, 'b')}
                                </div>
                            </td>

                            <td className="py-2">
                                <div className="flex flex-wrap justify-center gap-1">
                                    {renderCapturedPieces(capturedData.w, 'w')}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-left py-2 font-semibold">
                                Advantage
                            </td>

                            <td className="py-2 font-bold">
                                {materialAdvantage > 0
                                    ? `+${materialAdvantage}`
                                    : ''}
                            </td>

                            <td className="py-2 font-bold">
                                {materialAdvantage < 0
                                    ? `+${Math.abs(materialAdvantage)}`
                                    : ''}
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>
        </>
    );
};

export default ChessBoard;


// {/* TOP - Black pieces captured by White */}
//                 <div>
//                     {renderCapturedPieces(topCapturedPieces)}
//                 </div>


//                 {/* BOTTOM - White pieces captured by Black */}
//                 <div>
//                     {renderCapturedPieces(bottomCapturedPieces)}
//                 </div>