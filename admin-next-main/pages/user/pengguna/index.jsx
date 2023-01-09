import React from "react";
import Layout from "../../../components/layouts/Layout";
import DataTable from "../../../components/widgets/DataTable";
import { useData } from "../../../utils/hooks/useData";

const title = "Pengguna";
const pageUrl = "/user/pengguna";
export const apiUrl = "/users";

const Pengguna = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "fullName",
      title: "Fullname"
    },
    {
      name: "userName",
      title: "Username",
    },
    {
      name: "password",
      title: "Password"
    },
    {
      name: "role",
      title: "Role",
      render: ({ item }) => (
        <span>{item?.userRole?.roleName}</span>
      )
    },
    {
      name: "jabatan",
      title: "Jabatan"
    },
    {
      name: "email",
      title: "Email",
    },
    {
      name: "contact",
      title: "Contact",
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

export default Pengguna;
