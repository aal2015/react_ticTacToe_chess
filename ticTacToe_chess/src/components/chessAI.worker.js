// import ChessMinMaxAlgo from "./ChessAI.js";

// self.onmessage = (event) => {
//     const {
//         board,
//         turn,
//         enPassantState,
//         castleState,
//         moveCount
//     } = event.data;

//     const algo = new ChessMinMaxAlgo();

//     const result = algo.minMax(
//         board,
//         turn,
//         enPassantState,
//         castleState,
//         moveCount,
//         0,
//         5,
//         -Infinity,
//         Infinity
//     );

//     self.postMessage(result);
// };

self.onmessage = (event) => {
    console.log("WORKER RECEIVED MESSAGE");

    self.postMessage({
        success: true,
        message: "Worker is working"
    });
};