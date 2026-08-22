import { describe, it, expect } from "vitest";
import { makeMove } from "../components/ChessAI";
import { initBoard, initCastleState } from "../components/chessUtil";

const emptyBoard = () =>
    Array.from({ length: 8 }, () => Array(8).fill(""));

describe("makeMove", () => {
    it("moves a white pawn two spaces from the start square", () => {
        const board = initBoard;
        const result = makeMove(
            board,
            initCastleState,
            "wp",
            6, 4,
            4, 4,
            0
        );

        expect(board[6][4]).toBe("");
        expect(board[4][4]).toBe("wp");

        expect(result.moveState).toEqual({
            fromSquare: [6, 4],
            toSquare: [4, 4],
            movingPiece: "wp",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.nextEnPassantState).toEqual({
            row: 4,
            col: 4,
            pieceColor: "white",
            moveCount: 1
        });
    })

    it("performs en passant capture", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // White pawn on d5
        board[3][3] = "wp";

        // Black pawn on e5
        board[3][4] = "bp";

        const enPassantState = {
            row: 3,
            col: 4,
            pieceColor: "black",
            moveCount: 1
        };

        const result = makeMove(
            board,
            initCastleState,
            "wp",
            3, 3,
            2, 4,
            20
        );

        expect(board[2][4]).toBe("wp");
        expect(board[3][4]).toBe("");

        expect(result.moveState).toEqual({
            fromSquare: [3, 3],
            toSquare: [2, 4],
            movingPiece: "wp",
            capturedPiece: "bp",
            capturedSquare: [3, 4]
        });
    })
})