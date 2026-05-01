import './ChessBoard.css';

const ChessBoard = ({ boardState }) => {
    console.log(boardState);
    return (
        <div id="chessGameBoard">
            {boardState.map((row, rowIndex) =>
                row.map((cell, cellIndex) => {
                    const isWhite = (rowIndex + cellIndex) % 2 === 0;

                    return (
                        <div
                            key={`${rowIndex}-${cellIndex}`}
                            className={`square ${isWhite ? 'whiteSquare' : 'darkBlue'}`}
                        >
                            
                        </div>
                    );
                })
            )}
        </ div>
    );
}

export default ChessBoard;