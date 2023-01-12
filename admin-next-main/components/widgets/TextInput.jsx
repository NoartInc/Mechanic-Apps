import React from 'react'

const TextInput = ({
    label = "Input Label",
    type = "text",
    name = "text_input",
    placeholder = "",
    form,
    min,
    classLabel = "",
    classInput = "",
    disabled = false
}) => {
    const inputClass = `text-input ${classInput} ${form.errors[name] && form.touched[name] ? 'border border-red-600' : ''}`.trim(' ');
    const labelClass = `input-label ${classLabel}`;

    return (
        <div className="relative field-input">
            <label htmlFor={name} className={labelClass}>{label}</label>
            <div className="input-column">
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    className={inputClass}
                    onChange={form.handleChange}
                    value={form.values[name] ?? undefined}
                    min={min}
                    disabled={disabled}
                />
                {form.errors[name] && form.touched[name] ? (
                    <small className="text-red-600">
                        {form.errors[name]}
                    </small>
                ) : null}
            </div>
        </div>
    )


}

export default TextInput