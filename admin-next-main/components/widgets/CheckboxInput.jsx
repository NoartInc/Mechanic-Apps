import React from 'react'

const CheckboxInput = ({
    label = "Input Label",
    name = "check_input",
    id = "check-input",
    onChange,
    value,
    noLabel = false,
    layout = "row"
}) => {

    if (!noLabel) {
        return (
            <div className={`relative ${layout === "row" ? "field-input" : "flex flex-col"}`}>
                {!noLabel && (
                    <label className="input-check-label" htmlFor={id}>{label}</label>
                )}
                <div className="input-column" style={{ width: 4 }}>
                    <InputCheck name={name} id={id} checked={value} onChange={onChange} />
                </div>
            </div>
        )
    }

    return <InputCheck name={name} id={id} checked={value} onChange={onChange} />
}

const InputCheck = (props) => (
    <input
        {...props}
        type="checkbox"
        className="input-check"
    />
)

export default CheckboxInput