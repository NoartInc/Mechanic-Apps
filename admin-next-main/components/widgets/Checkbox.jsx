import React from 'react'

const Checkbox = ({
    label = "Input Label",
    name = "check_input",
    id = "check-input",
    form = null,
    data = {},
    access = "view",
    onChange = () => null,
    checked = false
}) => {
    return (
        <div className="flex gap-x-1">
            <input 
                type="checkbox" 
                id={id}
                name={name}
                className=""
                onChange={(event) => onChange(data?.path, {[access]: event.target.checked})}
                checked={checked}
            />
            <label htmlFor={id} className="cursor-pointer">{label}</label>
        </div>
    )
}

export default Checkbox