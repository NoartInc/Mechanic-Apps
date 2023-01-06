import { IconPlus } from '@tabler/icons'
import React from 'react'

const AddButton = ({ onClick = () => null }) => {
    return (
        <button type="button" className="button button-primary" onClick={onClick}>
            <span className="block md:hidden">
                <IconPlus />
            </span>
            <span className="hidden md:block">Tambah</span>
        </button>
    )
}

export default AddButton