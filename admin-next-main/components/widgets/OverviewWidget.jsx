import React from 'react'

const OverviewWidget = ({ label, value, icon }) => {
    const Icon = icon;
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-x-2 m-3">
            <div>
                <Icon className="w-9 h-9" />
            </div>
            <div className="flex flex-col">
                <h3 className="text-md">{label}</h3>
                <h5 className="text-sm font-semibold">{value}</h5>
            </div>
        </div>
    )
}

export default OverviewWidget