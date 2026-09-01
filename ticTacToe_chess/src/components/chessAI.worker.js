import { ChessMinMaxAlgo } from "./ChessAI.js";

self.onmessage = (event) => {
    const {
        board,
        turn,
        enPassantState,
        castleState,
        moveCount,
        depth
    } = event.data;

    try {
        const algo = new ChessMinMaxAlgo();

        const result = algo.minMax(
            board,
            turn,
            enPassantState,
            castleState,
            moveCount,
            0,
            depth,
            -Infinity,
            Infinity
        );

        self.postMessage({
            move: result.move
        });
    } catch (error) {
        self.postMessage({
            error: error.message
        });
    }
};