import React from 'react'

const SummaryWidget = ({ icon, label, value }) => {
    const Icon = icon;

    return (
        <div className="card-box mb-4 animated-card">
            <div className="flex flex-col md:flex-row gap-x-4 gap-y-2 md:items-center">
                <div className="rounded-lg bg-gray-200 p-3 self-start">
                    <Icon size={32} className="text-gray-700" />
                </div>
                <div className="flex flex-col">
                    <h5 className="text-gray-600">{label}</h5>
                    <h4 className="font-semibold text-lg text-gray-800">{value}</h4>
                </div>
            </div>
        </div>
    )
}

export default SummaryWidget