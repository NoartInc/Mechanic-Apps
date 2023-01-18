import { useRouter } from "next/router";
import React from "react";
import { apiUrl, title } from "..";
import Layout from "../../../../components/layouts/Layout";
import { get } from "../../../../utils/api";
import PerbaikanIcon from "../../../../components/icons/PerbaikanIcon";
import KategoriIcon from "../../../../components/icons/KategoriIcon";
import OverviewWidget from "../../../../components/widgets/OverviewWidget";
import LokasiIcon from "../../../../components/icons/LokasiIcon";
import AlertIcon from "../../../../components/icons/AlertIcon";
import MerkIcon from "../../../../components/icons/MerkIcon";
import PerbaikanList from "../../../../components/widgets/overviews/PerbaikanList";

const Mesin = () => {
  const { id } = useRouter()?.query;
  const [row, setRow] = React.useState(null);
  const [renderList, setRenderList] = React.useState(false);
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
      })
  };

  React.useEffect(() => {
    getRow();
    // eslint-disable-next-line
  }, [id]);
  return (
    <Layout title={title}>
      <div className="card-page mb-4">
        <h4 className="text-lg">{row?.mesin}</h4>
        <div className="grid grid-cols-2 md:grid-cols-5">
          <OverviewWidget label="Perbaikan" value={1} icon={PerbaikanIcon} />
          <OverviewWidget label="Kategori" value={row?.kategori} icon={KategoriIcon} />
          <OverviewWidget label="Lokasi" value={row?.lokasi} icon={LokasiIcon} />
          <OverviewWidget label="Status" value={(<span className="capitalize">{row?.status}</span>)} icon={AlertIcon} />
          <OverviewWidget label="Merk" value={row?.merk} icon={MerkIcon} />
        </div>
      </div>
      {row?.id && (
        <PerbaikanList 
          filters={{ mesin: row?.id }}
        />
      )}
    </Layout>
  );
};

export default Mesin;
