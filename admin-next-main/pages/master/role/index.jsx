import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

const title = "Role";
const pageUrl = "/master/roles";
export const apiUrl = "/roles";

const Role = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "roleName",
      title: "Role"
    },
    {
      name: "roleAccess",
      title: "Role Access"
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

export default Role;
