import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

const title = "Kerusakan";
const pageUrl = "/master/kerusakan";
export const apiUrl = "/kerusakan";

const Kerusakan = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "kerusakan",
      title: "Kerusakan"
    },
    {
      name: "durasi",
      title: "Durasi",
    },
    {
      name: "poin",
      title: "Poin",
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

export default Kerusakan;
