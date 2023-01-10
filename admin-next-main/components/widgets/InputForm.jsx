import React from 'react'

const InputForm = ({
    onChange,
    name,
    value,
    type = "text",
    placeholder,
    label
}) => {
    const inputClass = `text-input`.trim(' ');
    const labelClass = `input-label`;

    return (
        <div className="relative flex flex-col">
            <label
                htmlFor={name}
                className={labelClass}
            >{label}</label>
            <div className="input-column">
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className={inputClass}
                    onChange={(event) => onChange(event)}
                    value={value}
                />
            </div>
        </div>
    )
}

export default InputForm