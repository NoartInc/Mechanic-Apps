import { IconChevronDown, IconX } from '@tabler/icons'
import React from 'react'
import menu from '../../data/menu'
import Link from 'next/link'
import Image from 'next/image'

function Sidebar({ sidebarToggle }) {
    return (
        <aside id="sidebar" className="relative">
            <button
                type="button"
                className="icon-button absolute top-0 right-0 m-2 sm:block md:hidden"
                onClick={sidebarToggle}
            >
                <IconX />
            </button>
            <header className="px-8 pb-5 pt-8">
                <Image src="/images/logo.png" width={180} height={45} alt="" style={{ height: 'auto', width: 'auto' }} priority />
            </header>
            <div className="p-4">
                <ul className="sidebar-menu">
                    {menu.map((item, index) => (
                        <SidebarItem key={index} {...item} />
                    ))}
                </ul>
            </div>
        </aside>
    )
}

const SidebarItem = ({ path, title, icon = null, children = null }) => {
    const [showDropdown, setShowDropdown] = React.useState(false);
    const Icon = icon ? icon : null;
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }
    return (
        <li className="sidebar-item">
            <Link
                href={path}
                className={`sidebar-link ${children ? `sidebar-link-dropdown ${showDropdown ? 'show' : ''}` : ''}`}
                onClick={toggleDropdown}
            >
                {Icon && <Icon size={20} />}
                <span className="ml-4">{title}</span>
                {children && (
                    <span className="caret">
                        <IconChevronDown />
                    </span>
                )}
            </Link>
            {children && (
                <ul className={`sub-sidebar-menu ${showDropdown ? 'show' : ''}`}>
                    {children?.map((child, index) => (
                        <SidebarItem key={index} {...child} />
                    ))}
                </ul>
            )}
        </li>
    )
}

export default Sidebar