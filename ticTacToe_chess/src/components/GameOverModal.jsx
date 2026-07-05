function GameOverModal({
    isOpen,
    title,
    message,
    onPlayAgain,
    onClose
}) {

    if (!isOpen) return null;

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/60
                flex
                items-center
                justify-center
                z-50
            "
        >
            <div
                className="
                    bg-slate-800
                    rounded-xl
                    p-8
                    shadow-2xl
                    border
                    border-white/20
                    w-96
                    text-center
                "
            >
                <h2
                    className="
                        text-3xl
                        font-bold
                        text-white
                        mb-4
                    "
                >
                    {title}
                </h2>

                <p
                    className="
                        text-gray-300
                        mb-8
                    "
                >
                    {message}
                </p>

                <div
                    className="
                        flex
                        justify-center
                        gap-4
                    "
                >
                    <button
                        onClick={onClose}
                        className="
                            px-6
                            py-3
                            rounded-lg
                            bg-gray-600
                            hover:bg-gray-500
                            text-white
                            font-semibold
                            transition
                        "
                    >
                        Close
                    </button>

                    <button
                        onClick={onPlayAgain}
                        className="
                            px-6
                            py-3
                            rounded-lg
                            bg-cyan-500
                            hover:bg-cyan-400
                            text-white
                            font-semibold
                            transition
                        "
                    >
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameOverModal;