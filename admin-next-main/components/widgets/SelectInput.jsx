import React from 'react'

const SelectInput = ({
    label = "Input Label",
    name = "text_input",
    form,
    options = []
}) => {
    const inputClass = `text-input ${form.errors[name] && form.touched[name] ? 'border border-red-600' : ''}`.trim(' ');
    const labelClass = `input-label`;
    return (
        <div className="relative field-input">
            <label
                htmlFor={name}
                className={labelClass}
            >{label}</label>
            <div className="input-column">
                <select
                    id={name}
                    name={name}
                    className={inputClass}
                    onChange={form.handleChange}
                    value={form.values[name]}
                >
                    <option value="">- Select Option -</option>
                    {options?.length && options?.map((option, index) => (
                        <option key={index} value={option?.value}>
                            {option?.label}
                        </option>
                    ))}
                </select>
                {form.errors[name] && form.touched[name] ? (
                    <small className="text-red-600">
                        {form.errors[name]}
                    </small>
                ) : null}
            </div>
        </div>
    )
}

export default SelectInput