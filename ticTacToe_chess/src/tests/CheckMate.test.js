import { describe, it, expect } from "vitest";
import { isCheckMate } from "../components/moveValidCheck";

const emptyBoard = () =>
    Array.from(
        { length: 8 },
        () => Array(8).fill('')
    );


describe("Checkmate detection", () => {
    it("detects simple queen checkmate", () => {
        const board = emptyBoard();

        board[0][6] = "bk"; // g8
        board[1][6] = "wq"; // g7
        board[2][6] = "wk"; // g6


        expect(
            isCheckMate(
                board,
                "black",
                null,
                0
            )
        ).toBe(true);

    });

    it("returns false when king can escape", () => {


        const board = emptyBoard();

        board[0][6] = "bk"; // g8
        board[2][6] = "wq"; // g6
        board[3][6] = "wk"; // g5


        const result =
            isCheckMate(
                board,
                "black",
                null,
                0
            );


        expect(result)
            .toBe(false);

    });

    it("returns false when king is not checked", () => {


        const board = emptyBoard();


        board[0][5] = "bk"; // f8
        board[2][6] = "wq"; // g6
        board[3][6] = "wk"; // g5


        const result =
            isCheckMate(
                board,
                "black",
                null,
                0
            );


        expect(result)
            .toBe(false);

    });
});