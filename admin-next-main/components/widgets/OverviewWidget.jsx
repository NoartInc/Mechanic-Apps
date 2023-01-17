import React from 'react'

const OverviewWidget = ({ label, value, icon }) => {
    const Icon = icon;
    return (
        <div className="flex items-center gap-x-2 m-3">
            <div>
                <Icon className="w-9 h-9" />
            </div>
            <div className="flex flex-col">
                <h3 className="text-sm">{label}</h3>
                <h5 className="text-md font-semibold">{value}</h5>
            </div>
        </div>
    )
}

export default OverviewWidget