import React from 'react'
import { IconUser, IconMenu2, IconLogout } from '@tabler/icons'
import Dropdown from '../widgets/Dropdown'

const Topnav = ({ sidebarToggle }) => {
    return (
        <header id="topnav">
            <div className="flex-shrink-0">
                <button type="button" className="icon-button sm:block md:hidden" onClick={sidebarToggle}>
                    <IconMenu2 />
                </button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex-shrink-0">
                <Dropdown text="Administrator" icon={IconUser} align="right">
                    <div className="py-5">
                        <h4 className="text-center">Administrator</h4>
                    </div>
                    <div className="flex justify-between items-center gap-x-2">
                        <button type="button" className="button button-danger">
                            <IconLogout size={20} />
                            <span>Keluar</span>
                        </button>
                    </div>
                </Dropdown>
            </div>
        </header>
    )
}

export default Topnav