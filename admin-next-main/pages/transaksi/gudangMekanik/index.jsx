import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

export const title = "Gudang Mekanik";
const pageUrl = "/transaksi/gudangMekanik";
export const apiUrl = "/gudangMekanik";

const GudangMekanik = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "sparepart",
      title: "Gudang Mekanik"
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

export default GudangMekanik;
