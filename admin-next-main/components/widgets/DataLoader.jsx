import { IconCircleDashed } from '@tabler/icons'
import React from 'react'

const DataLoader = () => {
    return (
        <div className="flex justify-center items-center gap-x-2 my-2 rounded-md py-8 border border-gray-200">
            <IconCircleDashed className="animate-spin" />
            <h4 className="text-center">Loading...</h4>
        </div>
    )
}

export default DataLoader