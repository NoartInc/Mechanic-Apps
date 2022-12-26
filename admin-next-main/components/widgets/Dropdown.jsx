import React from 'react'

const Dropdown = ({ text = "Button", icon = null, children, align = "left" }) => {
    const Icon = icon ? icon : null;
    return (
        <div className="relative">
            <button type="button" className="dropdown-button">
                {Icon && <Icon size={24} />}
                <span className="hidden md:block">{text}</span>
            </button>
            <div className={align === "left" ? "dropdown-content" : "dropdown-content-right"}>
                {children}
            </div>
        </div>
    )
}

export default Dropdown