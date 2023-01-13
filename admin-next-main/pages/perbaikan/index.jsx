import moment from "moment/moment";
import React from "react";
import Layout from "../../components/layouts/Layout";
import DataTable from "../../components/widgets/DataTable";
import { useData } from "../../utils/hooks/useData";

const title = "Perbaikan";
const pageUrl = "/perbaikan";
export const apiUrl = "/perbaikan";

const Perbaikan = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "noLaporan",
      title: "No. Laporan"
    },
    {
      name: "jenisPerbaikan",
      title: "Jenis",
      render: ({ value }) => {
        return value?.toUpperCase();
      }
    },
    {
      name: "machine",
      title: "Mesin",
      render: ({ value }) => (
        <span>{value?.mesin ?? "-"}</span>
      )
    },
    {
      name: "startDate",
      title: "Start",
      render: ({ value }) => moment(value).format("DD/MM/YYYY HH:mm")
    },
    {
      name: "endDate",
      title: "End",
      render: ({ value }) => value ? moment(value).format("DD/MM/YYYY HH:mm") : "-"
    },
    {
      name: "mekaniks",
      title: "Mekanik",
      render: ({ value }) => {
        return value?.map(item => (
          <span key={item?.id} className="mr-1 p-1 px-2 rounded bg-green-600 text-white">
            {item?.mekanik}
          </span>
        ))
      }
    },
    {
      name: "spareparts",
      title: "Sparepart",
      className: "text-center",
      render: ({ value }) => (
        <span className={`p-1 px-2 rounded text-white ${value?.length ? 'bg-green-600' : 'bg-gray-700'}`}>
          {value?.length}
        </span>
      )
    },
    {
      name: "kerusakans",
      title: "Kerusakan",
      className: "text-center",
      render: ({ value }) => (
        <span className={`p-1 px-2 rounded text-white ${value?.length ? 'bg-orange-600' : 'bg-gray-700'}`}>
          {value?.length}
        </span>
      )
    }
  ];

  return (
    <Layout title={title}>
      <DataTable
        {...data}
        title={title}
        columns={columns}
        pageUrl={pageUrl}
      />
    </Layout>
  );
};

export default Perbaikan;
