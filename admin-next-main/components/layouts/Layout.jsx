import React from 'react'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Topnav from './Topnav'

const Layout = ({ children }) => {
    const sidebarToggle = () => {
        let sidebarEl = document.querySelector("#sidebar");
        if (sidebarEl.classList.contains("show")) {
            sidebarEl.classList.remove("show");
        } else {
            sidebarEl.classList.add("show");
        }
    }
    return (
        <div id="wrapper">
            <Sidebar sidebarToggle={sidebarToggle} />
            <div id="content-wrapper">
                <Topnav sidebarToggle={sidebarToggle} />
                <main className="p-4">
                    {children}
                </main>
                <Footer sidebarToggle={sidebarToggle} />
            </div>
        </div>
    )
}

export default Layout;