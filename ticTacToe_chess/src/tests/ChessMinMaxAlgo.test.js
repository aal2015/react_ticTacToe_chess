import { describe, it, expect } from "vitest";
import { ChessMinMaxAlgo } from "../components/ChessAI";

const algo = new ChessMinMaxAlgo();

const emptyBoard = () =>
    Array.from({ length: 8 }, () => Array(8).fill(""));

const castleState = {
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteLeftRookMoved: false,
    whiteRightRookMoved: false,
    blackLeftRookMoved: false,
    blackRightRookMoved: false
};

describe("evaluateBoard", () => {

    it("returns 0 for king vs king", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";

        expect(algo.evaluateBoard(board)).toBe(0);
    });

    it("counts white queen advantage", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";
        board[3][3] = "wq";

        expect(algo.evaluateBoard(board)).toBe(9);
    });

    it("counts black rook advantage", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";
        board[3][3] = "br";

        expect(algo.evaluateBoard(board)).toBe(-5);
    });

    it("computes mixed material correctly", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";

        board[1][1] = "wq";
        board[2][2] = "wr";
        board[3][3] = "bp";

        // 9 + 5 - 1 = 13
        expect(algo.evaluateBoard(board)).toBe(13);
    });

});

describe("minMax terminal states", () => {

    it("returns board evaluation at max depth", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";
        board[3][3] = "wq";

        const result = algo.minMax(
            board,
            "white",
            null,
            castleState,
            0,
            3,
            3,
            -Infinity,
            Infinity
        );

        expect(result).toEqual({
            score: 9,
            move: null
        });
    });

    it("returns negative score when white is checkmated", () => {
        const board = emptyBoard();

        // White king
        board[0][0] = "wk";

        // Black queen
        board[1][1] = "bq";

        // Black king protecting queen
        board[2][2] = "bk";

        const result = algo.minMax(
            board,
            "white",
            null,
            castleState,
            0,
            0,
            3,
            -Infinity,
            Infinity
        );

        expect(result).toEqual({
            score: -1000,
            move: null
        });
    });

    it("returns positive score when black is checkmated", () => {
        const board = emptyBoard();

        // Black king
        board[0][0] = "bk";

        // White queen
        board[1][1] = "wq";

        // White king protecting queen
        board[2][2] = "wk";

        const result = algo.minMax(
            board,
            "black",
            null,
            castleState,
            0,
            0,
            3,
            -Infinity,
            Infinity
        );

        expect(result).toEqual({
            score: 1000,
            move: null
        });
    });

    it("returns draw score for stalemate", () => {
        const board = emptyBoard();

        // Black king a8
        board[0][0] = "bk";

        // White queen c7
        board[1][2] = "wq";

        // White king c6
        board[2][2] = "wk";

        const result = algo.minMax(
            board,
            "black",
            null,
            castleState,
            0,
            0,
            3,
            -Infinity,
            Infinity
        );

        expect(result).toEqual({
            score: 0,
            move: null
        });
    });

    it("adjusts mate score based on depth", () => {
        const board = emptyBoard();

        // Black king
        board[0][0] = "bk";

        // White queen
        board[1][1] = "wq";

        // White king
        board[2][2] = "wk";

        const result = algo.minMax(
            board,
            "black",
            null,
            castleState,
            0,
            4,
            6,
            -Infinity,
            Infinity
        );

        expect(result).toEqual({
            score: 996, // 1000 - 4
            move: null
        });
    });

    it("prefers normal pawn capture when it wins material", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // White pawn
        board[3][3] = "wp";

        // Black pawn that can be captured
        board[2][4] = "bp";

        const result = algo.minMax(
            board,
            "white",
            null, // no en passant
            {},
            0,
            0,
            1,
            -Infinity,
            Infinity
        );

        expect(result.move).toEqual({
            from: [3, 3],
            to: [2, 4],
            promotion: null
        });

        expect(result.score).toBe(1);
    });

    it("prefers en passant capture when it wins material", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // White pawn on d5
        board[3][3] = "wp";

        // Black pawn on e5
        board[3][4] = "bp";

        const castleState = {
            whiteKingMoved: false,
            blackKingMoved: false,
            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,
            blackLeftRookMoved: false,
            blackRightRookMoved: false
        };

        const enPassantState = {
            row: 3,
            col: 4,
            pieceColor: "black",
            moveCount: 1
        };

        const result = algo.minMax(
            board,
            "white",
            enPassantState,
            castleState,
            2,
            0,
            1,
            -Infinity,
            Infinity
        );

        expect(result.move).toEqual({
            from: [3, 3],
            to: [2, 4],
            promotion: null
        });

        expect(result.score).toBe(1);
    });

    it("finds a checking rook move", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][7] = "bk";

        // Black pawns on f7, g7, and h7
        board[1][5] = "bp";
        board[1][6] = "bp";
        board[1][7] = "bp";

        // White rook on a1
        board[7][0] = "wr";

        const result = algo.minMax(
            board,
            "white",
            null, // no en passant
            {},
            0,
            0,
            1,
            -Infinity,
            Infinity
        );

        expect(result.move).toEqual({
            from: [7, 0],
            to: [0, 0],
            promotion: null
        });

        expect(result.score).toBe(999);
    });

    it("finds a rook move to checkmate in 2", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[1][7] = "bk";

        // White rooks on a6 and b5
        board[2][0] = "wr";
        board[3][1] = "wr";

        const result = algo.minMax(
            board,
            "white",
            null, // no en passant
            {},
            0,
            0,
            3,
            -Infinity,
            Infinity
        );

        console.log(result);

        expect(result.move).toEqual({
            from: [3, 1],
            to: [1, 1],
            promotion: null
        });

        expect(result.score).toBe(997);
    });
});