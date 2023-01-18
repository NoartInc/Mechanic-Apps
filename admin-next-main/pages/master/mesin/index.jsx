import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";
import Link from "next/link";

export const title = "Mesin";
const pageUrl = "/master/mesin";
export const apiUrl = "/machine";

const Mesin = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "mesin",
      title: "Mesin",
      render: ({ item, value }) => (
        <Link href={`${pageUrl}/overview/${item?.id}`} className="text-blue-600 hover:text-blue-700">{value}</Link>
      )
    },
    {
      name: "kategori",
      title: "Kategori",
    },
    {
      name: "lokasi",
      title: "Lokasi",
    },
    {
      name: "merk",
      title: "Merk",
    },
    {
      name: "status",
      title: "Status",
      render: ({ value }) => (
        <span className={`p-1 px-2 text-sm rounded-lg ${value === "active" ? "bg-green-600" : "bg-gray-600"} text-white uppercase`}>
          {value}
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

export default Mesin;
