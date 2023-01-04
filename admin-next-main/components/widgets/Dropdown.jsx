import React from 'react'

const Dropdown = ({ text = "Button", icon = null, children, align = "left" }) => {
    const Icon = icon ? icon : null;
    const dropdownToggle = (event) => {
        if (event.currentTarget.nextElementSibling.classList.contains("show")) {
            event.currentTarget.nextElementSibling.classList.remove("show");
        } else {
            event.currentTarget.nextElementSibling.classList.add("show");
        }
    }
    React.useEffect(() => {
        document.addEventListener("click", function (event) {
            if (!event.target.matches(".dropdown-button")) {
                let dropdowns = document.getElementsByClassName("dropdown-container");
                let i;
                for (i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        });
    }, []);
    return (
        <div className="relative">
            <button type="button" className="dropdown-button" onClick={dropdownToggle}>
                {Icon && <Icon size={24} className="pointer-events-none" />}
                <span className="hidden md:block pointer-events-none">{text}</span>
            </button>
            <div className={`dropdown-container z-10 ${align === "left" ? "dropdown-content" : "dropdown-content-right"}`.trim(' ')}>
                {children}
            </div>
        </div>
    )
}

export default Dropdown