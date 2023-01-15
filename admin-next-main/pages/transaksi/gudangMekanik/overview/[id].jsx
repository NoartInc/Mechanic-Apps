import { useRouter } from "next/router";
import React from "react";
import { apiUrl, title } from "..";
import Layout from "../../../../components/layouts/Layout";
import { get } from "../../../../utils/api";

const GudangMekanik = () => {
  const { id } = useRouter()?.query;
  const [row, setRow] = React.useState(null);
  const getRow = () => {
    get(`${apiUrl}/${id}`)
      .then((result) => {
        if (result?.id) {
          setRow(result);
        }
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          text: "Data tidak ditemukan!",
        });
      });
  };

  React.useEffect(() => {
    getRow();
    // eslint-disable-next-line
  }, [id]);
  return (
    <Layout title={title}>
      <div>{JSON.stringify(row)};</div>
    </Layout>
  );
};

export default GudangMekanik;
