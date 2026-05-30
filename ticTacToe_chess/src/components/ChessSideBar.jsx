import { useEffect, useRef } from 'react';

const ChessSideBar = ({ moveHistory, onReset }) => {

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
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

                <div ref={bottomRef} />
            </div>

            {/* Footer */}
            <div
                className="
                        border-t
                        p-3
                        flex
                        gap-2
                        flex-shrink-0
                    "
            >
                <button onClick={onReset}>
                    Reset
                </button>

                <button>
                    Export
                </button>
            </div>
        </div>
    );
};

export default ChessSideBar;