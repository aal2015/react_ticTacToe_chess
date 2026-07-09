import { describe, it, expect } from "vitest";
import { ChessMinMaxAlgo } from "../components/ChessAI";

const algo = new ChessMinMaxAlgo();

const emptyBoard = () =>
    Array.from({ length: 8 }, () => Array(8).fill(""));

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

        const score = algo.minMax(
            board,
            "white",
            null,
            {},
            0,
            3,
            3
        );

        expect(score).toBe(9);
    });

    it("returns -1000 when white is checkmated", () => {
        const board = emptyBoard();

        // White king
        board[0][0] = "wk";

        // Black queen
        board[1][1] = "bq";

        // Black king protecting queen
        board[2][2] = "bk";

        const score = algo.minMax(
            board,
            "white",
            null,
            {},
            0,
            0,
            3
        );

        expect(score).toBe(-1000);
    });

    it("returns 1000 when black is checkmated", () => {
        const board = emptyBoard();

        // Black king
        board[0][0] = "bk";

        // White queen
        board[1][1] = "wq";

        // White king protecting queen
        board[2][2] = "wk";

        const score = algo.minMax(
            board,
            "black",
            null,
            {},
            0,
            0,
            3
        );

        expect(score).toBe(1000);
    });

    it("returns 0 for stalemate", () => {
        const board = emptyBoard();

        // Black king a8
        board[0][0] = "bk";

        // White queen c7
        board[1][2] = "wq";

        // White king c6
        board[2][2] = "wk";

        const score = algo.minMax(
            board,
            "black",
            null,
            {},
            0,
            0,
            3
        );

        expect(score).toBe(0);
    });
});