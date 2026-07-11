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
            3
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
            3
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
            3
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
            3
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
            6
        );

        expect(result).toEqual({
            score: 996, // 1000 - 4
            move: null
        });
    });

});