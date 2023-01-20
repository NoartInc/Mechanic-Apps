import moment from "moment";
import Link from "next/link";
import React from "react";
import { statusList } from "../../../pages/perbaikan";
import { baseUrl } from "../../../utils/api";
import { useData } from "../../../utils/hooks/useData";
import useExport from "../../../utils/hooks/useExport";
import DataExport from "../DataExport";
import DataFilter from "../DataFilter";
import DataTable from "../DataTable";
import DateRangeFilter from "../DateRangeFilter";

const PerbaikanList = ({ filters = null, totalPerbaikan = () => null, dataList = () => null }) => {
    const data = useData("/perbaikan", filters);
    const exportData = useExport(`/export/perbaikan`, filters);
    const columns = [
        {
            name: "noLaporan",
            title: "No. ",
            style: {
                minWidth: 140,
            },
        },
        {
            name: "mesin",
            title: "Mesin",
            render: ({ item }) => (
                <span>{item?.machine?.mesin ?? "-"}</span>
            )
        },
        {
            name: "jenisPerbaikan",
            title: "Jenis",
            render: ({ value }) => {
                return value?.toUpperCase();
            },
        },
        {
            name: "createdAt",
            title: "Tanggal",
            style: {
                width: 140,
            },
            render: ({ value }) => moment(value).format("DD/MM/YYYY"),
        },
        {
            name: "status",
            title: "Status",
            className: "text-center",
            style: {
                width: 140,
            },
            render: ({ value }) => {
                return (
                    <span
                        className={`p-1 px-2 rounded-md ${getStatusColor(value)} uppercase`}
                    >
                        {value}
                    </span>
                );
            },
        },
        {
            name: "uploadPhotos",
            title: "Photo",
            className: "text-center",
            style: {
                width: 100,
            },
            render: ({ value }) => {
                if (value) {
                    return (
                        <Link href={`${baseUrl}/images/${value}`} target="_blank" className="p-1 px-2 rounded-md bg-blue-500 text-white">
                            Lihat File
                        </Link>
                    );
                } else {
                    return <span>-</span>;
                }
            },
        },
    ];

    const getStatusColor = (status) => {
        return statusList.find((item) => item?.status === status)?.className;
    };

    React.useEffect(() => {
        totalPerbaikan(data?.total);
        dataList(data?.list);
        // eslint-disable-next-line
    }, [data.total]);

    const DataHeader = (
        <div className="flex justify-between items-center mb-3">
            <div className="flex-shrink-0">
                <DataFilter onApply={() => data.applyFilter()} text="Pilih Tanggal">
                    <DateRangeFilter
                        onChange={(filter) => data.setFilter(filter)}
                        value={data.filters?.dateRange}
                    />
                </DataFilter>
            </div>
            <div className="flex-shrink-0">
            <DataExport text='export' onApply={() => exportData.downloadData()}>
                <DateRangeFilter onChange={(filter) => exportData.onFilterChange(filter)} value={exportData.filters?.dateRange} />
            </DataExport>
            </div>
        </div>
    );

    return (
        <div>
            <DataTable
                {...data}
                title="Daftar Perbaikan"
                pageUrl="/perbaikan"
                dataHeader={DataHeader}
                action={false}
                columns={columns}
                footer={false}
            />
        </div>
    );


};

export default PerbaikanList;
