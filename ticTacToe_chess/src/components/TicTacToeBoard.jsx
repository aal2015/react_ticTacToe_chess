import Square from "./TicTacToeSquare";
import './TicTacToeBoard.css';

function Board({ boardState, onSquareClick }) {

  const squares = [];

  for (let i = 0; i < 9; i++) {
    squares.push(
      <Square
        key={i}
        value={boardState[i]}
        onClick={() => onSquareClick(i)}
      />
    );
  }

  return (
    <div className="tic-tac-toe-board">
      {squares}
    </div>
  );
}

export default Board;