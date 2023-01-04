import { IconChevronRight } from '@tabler/icons'
import { uniqBy } from 'lodash'
import Link from 'next/link'
import React from 'react'

const Breadcrumb = ({ breadcrumb }) => {
    const breadCrumbData = uniqBy(breadcrumb, "path");
    return (
        <ul className="breadcrumb">
            {breadCrumbData?.map((item, index) => (
                <li
                    key={index}
                    className={`breadcrumb-item ${index === breadCrumbData.length - 1 ? 'active' : ''}`}
                >
                    <Link
                        href={item.path}
                        className={` ${index === breadCrumbData.length - 1 ? 'text-gray-600' : 'text-blue-600'}`}
                    >
                        <span>
                            {item.title}
                        </span>
                    </Link>
                    {index !== breadCrumbData.length - 1 && (
                        <IconChevronRight size={18} className="text-gray-400" />
                    )}
                </li>
            ))}
        </ul>
    )
}

export default Breadcrumb