import Square from "./TicTacToeSquare";
import './TicTacToeBoard.css';

function Board() {

  const squares = [];

  for (let i = 0; i < 9; i++) {
    squares.push(
      <Square
        key={i}
        value={null}
        onClick={() => console.log("clicked", i)}
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