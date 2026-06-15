function Square({ value, onClick }) {
  return (
    <button 
      className={`tic-tac-toe-square ${value === "X" ? "x" : value === "O" ? "o" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

export default Square;