import { useEffect, useRef } from 'react';

const ChessSideBar = ({
    moveHistory, onReset, playerColor, onColorChange
}) => {
    const moveListRef = useRef(null);

    useEffect(() => {

        if (moveListRef.current) {

            moveListRef.current.scrollTop =
                moveListRef.current.scrollHeight;
        }

    }, [moveHistory]);

    return (
        <div
            className="
                border border-white
                rounded-lg
                h-[500px]
                text-white
                flex flex-col
            "
        >
            <div
                className="
        p-3
        border-b
        flex
        flex-col
        gap-2
    "
            >
                <p className="text-sm text-gray-300">
                    Play as {playerColor === 'white' ? 'White' : 'Black'}
                </p>

                <button
                    onClick={() =>
                        onColorChange(
                            playerColor === 'white'
                                ? 'black'
                                : 'white'
                        )
                    }
                    className={`
                                w-full
                                py-2
                                rounded-lg
                                border
                                font-semibold
                                transition-colors
                                ${playerColor === 'white'
                            ? 'bg-white text-black border-white'
                            : 'bg-black text-white border-white'
                        }
                            `}
                >
                    Switch to {playerColor === 'white' ? 'Black' : 'White'}
                </button>
            </div>

            {/* Header */}
            <div
                className="
                    p-3
                    border-b
                    font-bold
                    flex-shrink-0
                "
            >
                Moves
            </div>

            {/* Scrollable move list */}
            <div
                ref={moveListRef}
                className="
                    flex-1
                    overflow-y-auto
                    p-2
                "
            >
                {moveHistory.map((move) => (
                    <div
                        key={move.moveNumber}
                        className="
                            grid
                            grid-cols-[40px_1fr_1fr]
                            py-1
                        "
                    >
                        <span>{move.moveNumber}.</span>
                        <span>{move.white}</span>
                        <span>{move.black}</span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div
                className="
        border-t
        p-3
        flex
        justify-center
        gap-3
        flex-shrink-0
    "
            >
                <button
                    onClick={onReset}
                    className="
            px-4
            py-2
            rounded-lg
            border
            border-white/30
            transition-all
            hover:bg-white/10
            hover:border-white/60
        "
                >
                    Reset
                </button>

                <button
                    className="
            px-4
            py-2
            rounded-lg
            border
            border-white/30
            transition-all
            hover:bg-white/10
            hover:border-white/60
        "
                >
                    Export
                </button>
            </div>
        </div>
    );
};

export default ChessSideBar;