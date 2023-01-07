import React from 'react'
import Sidebar from './Sidebar'
import Topnav from './Topnav'
import Head from 'next/head'
import Breadcrumb from '../widgets/Breadcrumb'
import { useRouter } from 'next/router'

const Layout = ({ children, title = "App Title" }) => {
    const { pathname } = useRouter();
    const [breadCrumb, setBreadcrumb] = React.useState([
        {
            path: "/",
            title: "Home"
        }
    ]);
    const sidebarToggle = () => {
        let sidebarEl = document.querySelector("#sidebar");
        if (sidebarEl.classList.contains("show")) {
            sidebarEl.classList.remove("show");
        } else {
            sidebarEl.classList.add("show");
        }
    }
    React.useEffect(() => {
        setBreadcrumb(prevState => [
            ...prevState,
            {
                path: pathname,
                title: title
            }
        ])
        // eslint-disable-next-line
    }, [pathname]);
    return (
        <div id="wrapper">
            <Head>
                <title>{title}</title>
            </Head>
            <Sidebar sidebarToggle={sidebarToggle} />
            <div id="content-wrapper" className="bg-gray-50 min-h-screen">
                <Topnav sidebarToggle={sidebarToggle} />
                <main className="p-4 mb-3">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-shrink-0">
                            <Breadcrumb breadcrumb={breadCrumb} />
                        </div>
                    </div>
                    <div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout;