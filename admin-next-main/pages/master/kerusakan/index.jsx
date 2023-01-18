import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";
import { durationTemplate } from "../../../components/widgets/DurationInput";

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
      render: ({ value }) => {
        let durationValue = value?.split(" ");
        return (
          <span>{durationValue[0]} {durationTemplate?.find(item => item?.value === durationValue[1])?.label}</span>
        )
      }
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
