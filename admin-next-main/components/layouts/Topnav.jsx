import React from 'react'
import { IconUser, IconMenu2, IconLogout } from '@tabler/icons'
import Dropdown from '../widgets/Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/modules/auth'
import { useRouter } from 'next/router'

const Topnav = ({ sidebarToggle }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector(state => state.auth);

    const logoutApp = () => {
        dispatch(logout());
        router.push("/auth/login");
    }

    return (
        <header id="topnav">
            <div className="flex-shrink-0">
                <button type="button" className="icon-button sm:block md:hidden" onClick={sidebarToggle}>
                    <IconMenu2 />
                </button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex-shrink-0">
                <Dropdown text={user?.fullName} icon={IconUser} align="right">
                    <div className="py-5 flex flex-col justify-center items-center gap-y-2">
                        <div className="rounded-full border border-gray-200 p-3">
                            <IconUser />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h4 className="text-center">
                                {user?.fullName}
                            </h4>
                            <h6 className="text-sm text-gray-600">
                                {user?.userRole?.roleName}
                            </h6>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-x-2">
                        <button type="button" className="button button-danger" onClick={logoutApp}>
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