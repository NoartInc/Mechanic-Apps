import React from 'react'

const InputForm = ({
    onChange,
    name,
    value,
    type = "text",
    placeholder,
    label,
    disabled = false,
    className = "",
    errors = null,
    touched = null
}) => {
    const inputClass = `text-input ${errors[name] && touched[name] ? 'border border-red-600' : ''}`.trim(' ');
    const labelClass = `input-label`;

    return (
        <div className={`relative flex flex-col ${className}`.trim(' ')}>
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
                    disabled={disabled}
                />
                {errors[name] && touched[name] ? (
                    <small className="text-red-600" style={{ fontSize: 12 }}>
                        {errors[name]}
                    </small>
                ) : null}
            </div>
        </div>
    )
}

export default InputForm