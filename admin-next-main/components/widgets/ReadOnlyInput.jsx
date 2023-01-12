import React, { useId } from 'react'

const ReadOnlyInput = ({
    label = "Input Label",
    value
}) => {
    const inputClass = `text-input`;
    const labelClass = `input-label`;
    return (
        <div className="relative field-input">
            <label className={labelClass}>{label}</label>
            <div className="input-column">
                <input
                    type="text"
                    id={useId()}
                    className={inputClass}
                    value={value}
                    readOnly={true}
                />
            </div>
        </div>
    )


}

export default ReadOnlyInput