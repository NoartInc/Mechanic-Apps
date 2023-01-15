import { IconCircleDashed } from '@tabler/icons'
import React from 'react'

const SubmitButton = ({ loading, text = "Simpan" }) => {
    return (
        <div className="flex-shrink-0">
            <button type="submit" className="button button-primary" disabled={loading}>
                {loading && (
                    <IconCircleDashed className="animate-spin" />
                )}
                <span>{text}</span>
            </button>
        </div>
    )
}

export default SubmitButton