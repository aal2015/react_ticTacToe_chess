import { describe, it, expect } from "vitest";
import { initBitboards, bitboardsToBoard } from "../components/initialBitboards";

describe("Bitboard representation", () => {

    describe("initial bitboards - hexadecimal representation", () => {

        it("should correctly represent white pawns", () => {
            expect(initBitboards.whitePawns)
                .toBe(0x000000000000FF00n);
        });

        it("should correctly represent white knights", () => {
            expect(initBitboards.whiteKnights)
                .toBe(0x0000000000000042n);
        });

        it("should correctly represent white bishops", () => {
            expect(initBitboards.whiteBishops)
                .toBe(0x0000000000000024n);
        });

        it("should correctly represent white rooks", () => {
            expect(initBitboards.whiteRooks)
                .toBe(0x0000000000000081n);
        });

        it("should correctly represent white queen", () => {
            expect(initBitboards.whiteQueen)
                .toBe(0x0000000000000008n);
        });

        it("should correctly represent white king", () => {
            expect(initBitboards.whiteKing)
                .toBe(0x0000000000000010n);
        });


        it("should correctly represent black pawns", () => {
            expect(initBitboards.blackPawns)
                .toBe(0x00FF000000000000n);
        });

        it("should correctly represent black knights", () => {
            expect(initBitboards.blackKnights)
                .toBe(0x4200000000000000n);
        });

        it("should correctly represent black bishops", () => {
            expect(initBitboards.blackBishops)
                .toBe(0x2400000000000000n);
        });

        it("should correctly represent black rooks", () => {
            expect(initBitboards.blackRooks)
                .toBe(0x8100000000000000n);
        });

        it("should correctly represent black queen", () => {
            expect(initBitboards.blackQueen)
                .toBe(0x0800000000000000n);
        });

        it("should correctly represent black king", () => {
            expect(initBitboards.blackKing)
                .toBe(0x1000000000000000n);
        });
    });


    describe("bitboardsToBoard", () => {

        it("should convert the initial bitboards back to the initial 2D board", () => {

            const expectedBoard = [
                ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
                ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
                ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
            ];

            const result = bitboardsToBoard(initBitboards);

            expect(result).toEqual(expectedBoard);
        });

    });

});