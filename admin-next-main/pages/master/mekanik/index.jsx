import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

const title = "Mekanik";
const pageUrl = "/master/mekanik";
export const apiUrl = "/mekanik";

const Mekanik = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "mekanik",
      title: "Mekanik"
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
