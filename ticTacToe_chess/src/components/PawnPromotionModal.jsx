const PromotionModal = ({
    color,
    onSelect
}) => {

    const pieces = [
        { label: 'Queen', value: 'q' },
        { label: 'Rook', value: 'r' },
        { label: 'Bishop', value: 'b' },
        { label: 'Knight', value: 'n' }
    ];

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/70
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
                    p-6
                    shadow-xl
                    w-80
                "
            >
                <h2
                    className="
                        text-white
                        text-xl
                        font-bold
                        mb-4
                    "
                >
                    Promote Pawn
                </h2>

                <div className="grid grid-cols-2 gap-3">

                    {pieces.map((piece) => (

                        <button
                            key={piece.value}
                            onClick={() =>
                                onSelect(piece.value)
                            }
                            className="
                                bg-slate-700
                                hover:bg-slate-600
                                text-white
                                p-3
                                rounded-lg
                            "
                        >
                            {piece.label}
                        </button>

                    ))}

                </div>
            </div>
        </div>
    );
};

export default PromotionModal