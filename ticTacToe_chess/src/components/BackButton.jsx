import { useNavigate } from "react-router";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/")}
            className="
                        self-center
                        mt-4
                        px-4
                        py-2
                        rounded-lg
                        border
                        border-white/30
                        text-white
                        hover:bg-white/10
                    "
        >
            ← Back
        </button>
    );
};

export default BackButton;