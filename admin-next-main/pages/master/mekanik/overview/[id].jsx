import { useRouter } from "next/router";
import React from "react";
import { apiUrl, title } from "..";
import Layout from "../../../../components/layouts/Layout";
import { get } from "../../../../utils/api";
import OverviewWidget from "../../../../components/widgets/OverviewWidget";
import PerbaikanList from "../../../../components/widgets/overviews/PerbaikanList";
import { Toast } from "../../../../utils/swal";
import UserIcon from "../../../../components/icons/UserIcon";
import ContactIcon from "../../../../components/icons/ContactIcon";
import StarIcon from "../../../../components/icons/StarIcon";

const Mekanik = () => {
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
      })
  };

  const getTotalPoin = (list) => {
    let totalPoin = list.reduce((acc, cur) => {
      let poinPerRecord = cur?.kerusakans?.reduce((accRecord, curRecord) => {
        return accRecord += curRecord?.poin;
      }, 0);
      return acc += poinPerRecord;
    }, 0);
    setRow(prevState => ({ ...prevState, totalPoin: totalPoin }));
  }

  React.useEffect(() => {
    getRow();
    // eslint-disable-next-line
  }, [id]);

  return (
    <Layout title={title}>
      <div className="card-page mb-4">
        <h4 className="text-lg">Mekanik Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-5">
          <OverviewWidget label="Mekanik" value={row?.mekanik} icon={UserIcon} />
          <OverviewWidget label="Contact" value={row?.kontak} icon={ContactIcon} />
          <OverviewWidget label="Poin" value={row?.totalPoin} icon={StarIcon} />
        </div>
      </div>
      {row?.id && (
        <PerbaikanList
          filters={{ mekanik: row?.id }}
          dataList={(list) => getTotalPoin(list)}
        />
      )}
    </Layout>
  );
};

export default Mekanik;
