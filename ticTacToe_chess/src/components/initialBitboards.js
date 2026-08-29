export const binaryToBitboard = (binary) => {
    const cleanBinary = binary.replace(/\s/g, "");

    if (cleanBinary.length !== 64) {
        throw new Error("Bitboard must contain exactly 64 bits");
    }

    return BigInt("0b" + cleanBinary);
};

export const initBitboards = {

    // =========================
    // WHITE
    // =========================

    whitePawns: binaryToBitboard(`
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        11111111
        00000000
    `),

    whiteKnights: binaryToBitboard(`
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        01000010
    `),

    whiteBishops: binaryToBitboard(`
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00100100
    `),

    whiteRooks: binaryToBitboard(`
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        10000001
    `),

    whiteQueen: binaryToBitboard(`
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00001000
    `),

    whiteKing: binaryToBitboard(`
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00010000
    `),


    // =========================
    // BLACK
    // =========================

    blackPawns: binaryToBitboard(`
        00000000
        11111111
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
    `),

    blackKnights: binaryToBitboard(`
        01000010
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
    `),

    blackBishops: binaryToBitboard(`
        00100100
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
    `),

    blackRooks: binaryToBitboard(`
        10000001
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
    `),

    blackQueen: binaryToBitboard(`
        00001000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
    `),

    blackKing: binaryToBitboard(`
        00010000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
        00000000
    `)
};

export const bitboardsToBoard = (bitboards) => {
    const board = Array.from(
        { length: 8 },
        () => Array(8).fill("")
    );

    const pieces = {
        whitePawns: "wp",
        whiteKnights: "wn",
        whiteBishops: "wb",
        whiteRooks: "wr",
        whiteQueen: "wq",
        whiteKing: "wk",

        blackPawns: "bp",
        blackKnights: "bn",
        blackBishops: "bb",
        blackRooks: "br",
        blackQueen: "bq",
        blackKing: "bk"
    };

    for (const [pieceBoard, piece] of Object.entries(pieces)) {
        let bitboard = bitboards[pieceBoard];

        for (let square = 0; square < 64; square++) {

            // Is this square occupied by this piece?
            if ((bitboard & (1n << BigInt(square))) !== 0n) {

                const row = 7 - Math.floor(square / 8);
                const col = square % 8;

                board[row][col] = piece;
            }
        }
    }

    return board;
};