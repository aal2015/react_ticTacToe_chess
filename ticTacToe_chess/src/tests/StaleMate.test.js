import { describe, it, expect } from "vitest";
import { isStaleMate } from "../components/moveValidCheck";

const emptyBoard = () =>
    Array.from(
        { length: 8 },
        () => Array(8).fill("")
    );

describe("Stalemate detection", () => {
    it("detects basic stalemate", () => {

        const board = emptyBoard();


        // Black king a8
        board[0][0] = "bk";


        // White queen c7
        board[1][2] = "wq";


        // White king c6
        board[2][2] = "wk";


        const result =
            isStaleMate(
                board,
                "black",
                null,
                0
            );


        expect(result).toBe(true);

    });



    it("returns false when king is in check", () => {

        const board = emptyBoard();


        // Black king g8
        board[0][6] = "bk";


        // White queen g7 attacks king
        board[1][6] = "wq";


        // White king g6
        board[2][6] = "wk";


        const result =
            isStaleMate(
                board,
                "black",
                null,
                0
            );


        expect(result).toBe(false);

    });



    it("returns false when a piece has a legal move", () => {

        const board = emptyBoard();


        // Black king a8
        board[0][0] = "bk";


        // Black rook h8
        board[0][7] = "br";


        // White king g6
        board[2][6] = "wk";


        const result =
            isStaleMate(
                board,
                "black",
                null,
                0
            );


        expect(result).toBe(false);

    });



});