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

    it("after a move which does not do castling, or move king or rooks, castling state should still be init", () => {
        const board = emptyBoard();

        // kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // rooks
        board[7][0] = "wr";
        board[7][7] = "wr";
        board[0][0] = "br";
        board[0][7] = "br";

        // pawns
        board[6][4] = "wp";
        board[1][4] = "bp";

        const result = makeMove(
            board,
            initCastleState,
            "wp",
            6, 4,
            4, 4,
            0
        );

        expect(board[4][4]).toBe("wp");
        expect(board[6][4]).toBe("");

        expect(result.castleState).toEqual(initCastleState);

        expect(result.moveState).toEqual({
            fromSquare: [6, 4],
            toSquare: [4, 4],
            movingPiece: "wp",
            capturedPiece: null,
            capturedSquare: null
        });
    })

    it("after white does king side castling, the castle state should be updated appropiately", () => {
        const board = emptyBoard();

        // kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // rooks
        board[7][0] = "wr";
        board[7][7] = "wr";
        board[0][0] = "br";
        board[0][7] = "br";

        // pawns
        board[6][4] = "wp";
        board[1][4] = "bp";

        const result = makeMove(
            board,
            initCastleState,
            "wk",
            7, 4,
            7, 6,
            0
        );

        expect(board[7][6]).toBe("wk");
        expect(board[7][5]).toBe("wr");

        expect(result.moveState).toEqual({
            fromSquare: [7, 4],
            toSquare: [7, 6],
            movingPiece: "wk",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: true,
            blackKingMoved: false,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,

            blackLeftRookMoved: false,
            blackRightRookMoved: false
        });
    })

    it("after white does queen side castling, the castle state should be updated appropiately", () => {
        const board = emptyBoard();

        // kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // rooks
        board[7][0] = "wr";
        board[7][7] = "wr";
        board[0][0] = "br";
        board[0][7] = "br";

        // pawns
        board[6][4] = "wp";
        board[1][4] = "bp";

        const result = makeMove(
            board,
            initCastleState,
            "wk",
            7, 4,
            7, 2,
            0
        );

        expect(board[7][2]).toBe("wk");
        expect(board[7][3]).toBe("wr");

        expect(result.moveState).toEqual({
            fromSquare: [7, 4],
            toSquare: [7, 2],
            movingPiece: "wk",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: true,
            blackKingMoved: false,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,

            blackLeftRookMoved: false,
            blackRightRookMoved: false
        });
    })

    it("after black does king side castling, the castle state should be updated appropriately", () => {
        const board = emptyBoard();

        // kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // rooks
        board[7][0] = "wr";
        board[7][7] = "wr";
        board[0][0] = "br";
        board[0][7] = "br";

        // pawns
        board[6][4] = "wp";
        board[1][4] = "bp";

        const result = makeMove(
            board,
            initCastleState,
            "bk",
            0, 4,
            0, 6,
            0
        );

        expect(board[0][6]).toBe("bk");
        expect(board[0][5]).toBe("br");

        expect(result.moveState).toEqual({
            fromSquare: [0, 4],
            toSquare: [0, 6],
            movingPiece: "bk",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: false,
            blackKingMoved: true,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,

            blackLeftRookMoved: false,
            blackRightRookMoved: false
        });
    });

    it("after black does queen side castling, the castle state should be updated appropriately", () => {
        const board = emptyBoard();

        // kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // rooks
        board[7][0] = "wr";
        board[7][7] = "wr";
        board[0][0] = "br";
        board[0][7] = "br";

        // pawns
        board[6][4] = "wp";
        board[1][4] = "bp";

        const result = makeMove(
            board,
            initCastleState,
            "bk",
            0, 4,
            0, 2,
            0
        );

        expect(board[0][2]).toBe("bk");
        expect(board[0][3]).toBe("br");

        expect(result.moveState).toEqual({
            fromSquare: [0, 4],
            toSquare: [0, 2],
            movingPiece: "bk",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: false,
            blackKingMoved: true,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,

            blackLeftRookMoved: false,
            blackRightRookMoved: false
        });
    });

    it("after white queen side rook moves, queen side castling should be disabled", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // White rooks
        board[7][0] = "wr";
        board[7][7] = "wr";

        const result = makeMove(
            board,
            initCastleState,
            "wr",
            7, 0,
            6, 0,
            0
        );

        expect(board[7][0]).toBe("");
        expect(board[6][0]).toBe("wr");

        expect(result.moveState).toEqual({
            fromSquare: [7, 0],
            toSquare: [6, 0],
            movingPiece: "wr",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: false,
            blackKingMoved: false,

            whiteLeftRookMoved: true,
            whiteRightRookMoved: false,

            blackLeftRookMoved: false,
            blackRightRookMoved: false
        });
    });

    it("after white king side rook moves, king side castling should be disabled", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // White rooks
        board[7][0] = "wr";
        board[7][7] = "wr";

        const result = makeMove(
            board,
            initCastleState,
            "wr",
            7, 7,
            6, 7,
            0
        );

        expect(board[7][7]).toBe("");
        expect(board[6][7]).toBe("wr");

        expect(result.moveState).toEqual({
            fromSquare: [7, 7],
            toSquare: [6, 7],
            movingPiece: "wr",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: false,
            blackKingMoved: false,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: true,

            blackLeftRookMoved: false,
            blackRightRookMoved: false
        });
    });

    it("after black queen side rook moves, queen side castling should be disabled", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // Black rooks
        board[0][0] = "br";
        board[0][7] = "br";

        const result = makeMove(
            board,
            initCastleState,
            "br",
            0, 0,
            1, 0,
            0
        );

        expect(board[0][0]).toBe("");
        expect(board[1][0]).toBe("br");

        expect(result.moveState).toEqual({
            fromSquare: [0, 0],
            toSquare: [1, 0],
            movingPiece: "br",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: false,
            blackKingMoved: false,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,

            blackLeftRookMoved: true,
            blackRightRookMoved: false
        });
    });

    it("after black king side rook moves, king side castling should be disabled", () => {
        const board = emptyBoard();

        // Kings
        board[7][4] = "wk";
        board[0][4] = "bk";

        // Black rooks
        board[0][0] = "br";
        board[0][7] = "br";

        const result = makeMove(
            board,
            initCastleState,
            "br",
            0, 7,
            1, 7,
            0
        );

        expect(board[0][7]).toBe("");
        expect(board[1][7]).toBe("br");

        expect(result.moveState).toEqual({
            fromSquare: [0, 7],
            toSquare: [1, 7],
            movingPiece: "br",
            capturedPiece: null,
            capturedSquare: null
        });

        expect(result.castleState).toEqual({
            whiteKingMoved: false,
            blackKingMoved: false,

            whiteLeftRookMoved: false,
            whiteRightRookMoved: false,

            blackLeftRookMoved: false,
            blackRightRookMoved: true
        });
    });
})