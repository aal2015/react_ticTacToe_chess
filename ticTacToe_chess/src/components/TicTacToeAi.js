export const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7],
    [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]
];

export const checkWinner = (boardState) => {
    for (let [a, b, c] of winPatterns) {
        if (boardState[a] !== '' &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]) {
            return true;
        }
    }
    return false;
};

const checkTerminalStates = (boardState) => {
    for (let [a, b, c] of winPatterns) {
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a] === 'X' ? 1 : -1;
        }
    }
    if (boardState.every(c => c !== '')) return 0;
    return null;
};

const minMaxFunc = (boardState, isMax) => {
    let result = checkTerminalStates(boardState);
    if (result !== null) return [result, null];

    let bestScore = isMax ? -Infinity : Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
            boardState[i] = isMax ? 'X' : 'O';

            let [score] = minMaxFunc(boardState, !isMax);

            boardState[i] = '';

            if (isMax ? score > bestScore : score < bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return [bestScore, move];
};

export const aiPlayMove = (boardState, AI_mark) => {

    if (checkTerminalStates(boardState) !== null) {
        return boardState;
    }

    let isMax = AI_mark === 'X';
    let [_, step] = minMaxFunc(boardState, isMax);

    if (step !== null) {
        boardState[step] = AI_mark;
    }

    return boardState;
};