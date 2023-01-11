import React from 'react'

const TextareaInput = ({
    label = "Input Label",
    name = "text_input",
    placeholder = "",
    form,
    rows = 5
}) => {
    const inputClass = `text-input ${form.errors[name] && form.touched[name] ? 'border border-red-600' : ''}`.trim(' ');
    const labelClass = `input-label`;

    return (
        <div className="relative field-input">
            <label htmlFor={name} className={labelClass}>{label}</label>
            <div className="input-column">
                <textarea
                    className={inputClass}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    onChange={form.handleChange}
                    value={form.values[name]}
                    rows={rows}
                    style={{ resize: "none" }}
                ></textarea>
                {form.errors[name] && form.touched[name] ? (
                    <small className="text-red-600">
                        {form.errors[name]}
                    </small>
                ) : null}
            </div>
        </div>
    )


}

export default TextareaInput