import { useRouter } from 'next/router'
import React from 'react'

const BackButton = () => {
    const router = useRouter();
    return (
        <div className="flex-shrink-0">
            <button
                type="button"
                className="button button-outline-primary"
                onClick={() => router.back()}
            >
                Kembali
            </button>
        </div>
    )
}

export default BackButton