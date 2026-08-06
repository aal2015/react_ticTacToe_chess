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

const PlayerMaterial = ({
    label,
    pieces,
    pieceColor,
    advantage
}) => {
    return (
        <div className="w-full max-w-[480px] min-h-[32px] flex items-center justify-start gap-2">
            <span className="text-white font-bold">
                {label}
            </span>

            <div className="flex items-center gap-1">
                {renderCapturedPieces(pieces, pieceColor)}
            </div>

            {advantage > 0 && (
                <span className="text-white font-bold">
                    +{advantage}
                </span>
            )}
        </div>
    );
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

    const playerMaterialAdvantage =
        playerColor === "white"
            ? materialScore.difference
            : -materialScore.difference;

    const playerAdvantage =
        playerMaterialAdvantage > 0
            ? playerMaterialAdvantage
            : 0;

    const botAdvantage =
        playerMaterialAdvantage < 0
            ? Math.abs(playerMaterialAdvantage)
            : 0;
    return (
        <>
            <div className="flex flex-col items-center">
                <PlayerMaterial
                    label="BOT"
                    pieces={topCapturedPieces}
                    pieceColor={playerColor === "white" ? "w" : "b"}
                    advantage={botAdvantage}
                />

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

                <PlayerMaterial
                    label="PLAYER"
                    pieces={bottomCapturedPieces}
                    pieceColor={playerColor === "white" ? "b" : "w"}
                    advantage={playerAdvantage}
                />
            </div>
        </>
    );
};

export default ChessBoard;