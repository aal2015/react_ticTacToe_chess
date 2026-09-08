import BaseModal from './BaseModal';

function GameResetModal({ isOpen, onConfirm, onCancel }) {
    return (
        <BaseModal 
            isOpen={isOpen}
            onConfirm={onConfirm}
            onCancel={onCancel}
            title="Reset Game?"
            message="Your current game will be lost."
            actionButtonLabel="Reset"
        />
    );
}

export default GameResetModal;