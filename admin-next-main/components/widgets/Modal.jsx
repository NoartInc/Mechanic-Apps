import React from 'react'

const Modal = ({ show, action = null, children, onClose, title = null }) => {
    if (show) {
        return (
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="modal-backdrop" />
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-inner">
                            {title && (
                                <div className="p-3 px-4 bg-gray-50">
                                    <h4 className="text-lg">{title}</h4>
                                </div>
                            )}
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