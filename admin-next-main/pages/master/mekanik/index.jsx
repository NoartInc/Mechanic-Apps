import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";
import Link from "next/link";

export const title = "Mekanik";
const pageUrl = "/master/mekanik";
export const apiUrl = "/mekanik";

const Mekanik = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "mekanik",
      title: "Mekanik",
      render: ({ value, item }) => (
        <Link href={`${pageUrl}/overview/${item?.id}`} className="text-blue-600 hover:text-blue-700">
          {value}
        </Link>
      )
    },
    {
      name: "kontak",
      title: "Kontak",
      style: {
        width: "200px"
      }
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

export default Mekanik;
