import { IconCircleDashed } from "@tabler/icons";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { statusList } from "../../../pages/perbaikan";
import { baseUrl } from "../../../utils/api";
import { useData } from "../../../utils/hooks/useData";
import DataFilter from "../DataFilter";
import DataTable from "../DataTable";
import DateRangeFilter from "../DateRangeFilter";

const PerbaikanList = ({ filters = null }) => {
  const data = useData("/perbaikan");
  const [loaded, setLoaded] = React.useState(false);
  const columns = [
    {
      name: "noLaporan",
      title: "No. ",
      style: {
        minWidth: 140,
      },
    },
    {
      name: "machine",
      title: "Mesin",
      render: ({ value }) => <span>{value?.mesin ?? "-"}</span>,
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
        width: 80,
      },
      render: ({ value }) => {
        if (value) {
          return (
            <Link href={`${baseUrl}/images/${value}`} target="_blank">
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
    data.setList([]);
    if (filters) {
      data.setFilter(filters);
    }
  }, [filters]);

  React.useEffect(() => {
    setTimeout(() => {
      data.getList();
      setLoaded(true);
    }, 1000);
  }, [data.filters]);

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
        <button className="button button-primary">Export</button>
      </div>
    </div>
  );

  if (!loaded) {
    return (
      <div className="card-page">
        <div className="flex justify-center items-center gap-x-2 my-2 rounded-md py-8 border border-gray-200">
          <IconCircleDashed className="animate-spin" />
          <h4 className="text-center">Loading...</h4>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataTable
        {...data}
        title="Daftar Perbaikan"
        pageUrl="/perbaikan"
        dataHeader={DataHeader}
        action={false}
        columns={columns}
      />
    </div>
  );
};

export default PerbaikanList;
