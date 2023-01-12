import moment from "moment/moment";
import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

const title = "Transaksi Sparepart";
const pageUrl = "/transaksi/transaksiSparepart";
export const apiUrl = "/transaksiSparepart";

const TransaksiSparepart = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "noReferensi",
      title: "No Ref"
    },
    {
      name: "supplier",
      title: "Supplier",
      render: ({ value }) => {
        return value ? value : "-";
      }
    },
    {
      name: "name",
      title: "Name",
    },
    {
      name: "type",
      title: "Type",
      render: ({ value }) => (
        <span className={`p-1 px-2 text-sm rounded text-white ${value === 'in' ? 'bg-green-600' : 'bg-red-600'}`}>
          {value}
        </span>
      )
    },
    {
      name: "status",
      title: "Status",
    },
    {
      name: "createdAt",
      title: "Date",
      render: ({ value }) => (
        <span>
          {moment(value).format("DD/MM/YYYY HH:mm")}
        </span>
      )
    },
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

export default TransaksiSparepart;
