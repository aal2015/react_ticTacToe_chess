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

    it("detects draw by insufficient material (king vs king)", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";

        expect(
            isStaleMate(board, "white", null, 0)
        ).toBe(true);

        expect(
            isStaleMate(board, "black", null, 0)
        ).toBe(true);
    });

    it("detects draw by insufficient material (king and bishop vs king)", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";
        board[6][6] = "wb";

        expect(
            isStaleMate(board, "black", null, 0)
        ).toBe(true);
    });

    it("detects draw by insufficient material (king and knight vs king)", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";
        board[6][6] = "wn";

        expect(
            isStaleMate(board, "black", null, 0)
        ).toBe(true);
    });

    it("detects draw by insufficient material (bishop vs bishop)", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[1][1] = "bb";

        board[7][7] = "wk";
        board[6][6] = "wb";

        expect(
            isStaleMate(board, "white", null, 0)
        ).toBe(true);

        expect(
            isStaleMate(board, "black", null, 0)
        ).toBe(true);
    });

    it("does not detect insufficient material when a pawn remains", () => {
        const board = emptyBoard();

        board[0][0] = "bk";
        board[7][7] = "wk";
        board[6][6] = "wp";

        expect(
            isStaleMate(board, "black", null, 0)
        ).toBe(false);
    });
});