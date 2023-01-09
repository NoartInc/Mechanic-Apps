import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

const title = "Role";
const pageUrl = "/user/role";
export const apiUrl = "/roles";

const Role = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "roleName",
      title: "Role"
    },
    {
      name: "userRoles",
      title: "Pengguna",
      render: ({ value }) => (
        <span className="p-1 px-2 text-sm rounded bg-green-600 text-white">{value?.length} Pengguna</span>
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

export default Role;
