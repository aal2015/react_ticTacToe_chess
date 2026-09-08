import BaseModal from './BaseModal';

function ColorSwitchModal({ isOpen, onConfirm, onCancel }) {
    // Handle color switching logic in parent component

    return (
        <BaseModal 
            isOpen={isOpen}
            onConfirm={onConfirm}
            onCancel={onCancel}
            title="Switch Color?"
            message="Your current game will be lost."
            actionButtonLabel="Switch Color"
        />
    );
}

export default ColorSwitchModal;
