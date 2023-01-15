import React from 'react'

const Modal = ({ show, action = null, children, onClose }) => {
    if (show) {
        return (
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="modal-backdrop" />
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-inner">
                            <div className="modal-body">
                                {children}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="default-button" onClick={onClose}>Cancel</button>
                                {action}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return null;
}

export default Modal