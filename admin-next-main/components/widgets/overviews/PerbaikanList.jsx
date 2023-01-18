import React from 'react'
import { useData } from '../../../utils/hooks/useData'
import DataTable from '../DataTable';

const PerbaikanList = ({ filters = null }) => {
    const data = useData("/perbaikan");

    const DataHeader = (
        <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
                <button className="button button-outline-primary">
                    Pilih Tanggal
                </button>
            </div>
            <div className="flex-shrink-0">
                <button className="button button-primary">
                    Export
                </button>
            </div>
        </div>
    )

    return (
        <div>
            <DataTable
                title="Daftar Perbaikan"
                pageUrl="/perbaikan"
            />
        </div>
    )
}

export default PerbaikanList