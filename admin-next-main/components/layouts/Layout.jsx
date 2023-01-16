import React from 'react'
import Sidebar from './Sidebar'
import Topnav from './Topnav'
import Head from 'next/head'
import Breadcrumb from '../widgets/Breadcrumb'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { IconCircleDashed } from '@tabler/icons'
import { useAccess } from '../../utils/hooks/useAccess'
import ForbiddenAccess from '../widgets/ForbiddenAccess';

const Layout = ({ children, title = "App Title" }) => {
    const { pathname } = useRouter();
    const { canAccess } = useAccess(pathname);
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

    if (canAccess("view")) {
        return (
            <div id="wrapper">
                <Head>
                    <title>{title}</title>
                </Head>
                <Sidebar sidebarToggle={sidebarToggle} />
                <div id="content-wrapper" className="bg-gray-200 min-h-screen">
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

    return <ForbiddenAccess />
}

export const Authorizing = ({ text = "Loading" }) => (
    <div className="bg-gray-200 min-h-screen">
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white rounded-md shadow-xl p-6">
                <div className="flex items-center gap-x-2">
                    <IconCircleDashed className="animate-spin" />
                    <h4 className="text-lg text-center">{text}...</h4>
                </div>
            </div>
        </div>
    </div>
)

const PrivatePage = (props) => {
    const { user, token } = useSelector(state => state.auth);
    const router = useRouter();

    const authCheck = () => {
        if (!user && !token) {
            router.push("/auth/login");
        }
    }

    React.useEffect(() => {
        authCheck();
        // eslint-disable-next-line
    }, [router.pathname]);

    if (!user && !token) {
        router.push("/auth/login");
        return (
            <Authorizing text="Checking Session" />
        )
    }

    return <Layout {...props} />
}

export default PrivatePage;