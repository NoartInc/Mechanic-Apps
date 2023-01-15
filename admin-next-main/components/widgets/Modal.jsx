import React, { Children } from 'react'

const Modal = ({ show, onSubmit = null, children }) => {

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
                                <button type="button" className="default-button">Cancel</button>
                                <button type="button" className="default-button">Cancel</button>
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