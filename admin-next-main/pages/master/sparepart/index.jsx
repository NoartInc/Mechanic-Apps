import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

const title = "Sparepart";
const pageUrl = "/master/sparepart";
export const apiUrl = "/sparepart";

const Sparepart = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "sparepart",
      title: "Sparepart"
    },
    {
      name: "kategori",
      title: "Kategori",
    },
    {
      name: "stok",
      title: "Stok",
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

export default Sparepart;
