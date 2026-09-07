function ColorSwitchModal({
    isOpen,
    onConfirm,
    onCancel,
    currentColor
}) {
    if (!isOpen) return null;

    const targetColor = currentColor === 'white' ? 'black' : 'white';

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-8 w-96 text-center">

                <h2 className="text-3xl font-bold text-white mb-4">
                    Switch Color?
                </h2>

                <p className="text-gray-300 mb-8">
                    Your current game will be lost.
                </p>

                <div className="flex justify-center gap-4">

                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-400"
                    >
                        Switch Color
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ColorSwitchModal;
