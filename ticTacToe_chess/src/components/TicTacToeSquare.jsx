function Square({ value, onClick }) {
  return (
    <button 
      className="tic-tac-toe-square" 
      onClick={onClick}
    >
      {value}
    </button>
  );
}

export default Square;