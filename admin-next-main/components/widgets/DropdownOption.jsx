import React from 'react'

const DropdownOption = ({ text, className, children }) => {
    const dropdownToggle = (event) => {
        if (event.currentTarget.nextElementSibling.classList.contains("show")) {
            event.currentTarget.nextElementSibling.classList.remove("show");
            document.getElementsByClassName("data-table-body")[0].classList.add("overflow-y-auto", "data-table-content");
        } else {
            event.currentTarget.nextElementSibling.classList.add("show");
            document.getElementsByClassName("data-table-body")[0].classList.remove("overflow-y-auto", "data-table-content");
        }
    }
    React.useEffect(() => {
        document.addEventListener("click", function (event) {
            if (!event.target.matches(".dropdown-option-button")) {
                let dropdowns = document.getElementsByClassName("dropdown-option-container");
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
        <div className="relative inline-block text-left">
            <button
                type="button"
                className={`dropdown-option-button ${className}`}
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={dropdownToggle}
            >
                {text}
            </button>
            <div className="dropdown-option-container" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                <div className="py-1" role="none">
                    {children}
                </div>
            </div>
        </div>

    )
}

export default DropdownOption