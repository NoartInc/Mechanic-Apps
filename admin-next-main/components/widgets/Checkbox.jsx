import React from 'react'

const Checkbox = ({
    label = "Input Label",
    name = "text_input",
    form,
    checkbox = []
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
                    {/* <checkbox value="">- Select Option -</checkbox> */}
                    {checkbox?.length && checkbox?.map((val, index) => (
                        <input key={index} value={val?.value}>
                            {val?.label}
                        </input>
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

export default Checkbox