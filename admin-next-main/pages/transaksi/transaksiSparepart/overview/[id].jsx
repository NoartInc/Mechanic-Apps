import React from 'react'
import Layout from '../../../../components/layouts/Layout'
import { get } from '../../../../utils/api';
import { useRouter } from 'next/router';
import { Toast } from '../../../../utils/swal';
import moment from 'moment';
import { IconArrowLeft } from '@tabler/icons';
import { apiUrl, pageUrl } from '..';
import { idrNumber } from '../../../../utils/helper';

const Detail = () => {
  const [row, setRow] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { id } = router?.query;

  const getRow = () => {
    setLoading(true);
    get(`${apiUrl}/${id}`)
      .then(result => {
        setRow(result);
      })
      .catch(error => {
        Toast.fire({
          icon: "error",
          text: error?.error ?? "Gagal memuat data!"
        });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      })
  }

  const TransactionType = () => {
    const typeClass = `uppercase p-1 px-2 rounded ${row?.type === "in" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`;
    return (
      <span className={typeClass} style={{ fontSize: 12 }}>
        {row?.type}
      </span>
    )
  }

  React.useEffect(() => {
    getRow();
    // eslint-disable-next-line
  }, [id]);

  return (
    <Layout title="Detail Transaksi">
      {/* Page header (back & Tanggal / waktu dibuatnya transaksi) */}
      <div className="card-page mb-3">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <button
              className="button button-outline-primary button-small"
              type="button"
              onClick={() => router.push(pageUrl)}
            >
              <IconArrowLeft />
              <span>Kembali</span>
            </button>
          </div>
          <div className="flex-shrink-0 flex pt-1">
            <DataInfo label="" value={moment(row?.createdAt).format("DD/MM/YYYY HH:mm")} hideLabel />
          </div>
        </div>
      </div>

      {/* Data Header Info */}
      <div className="card-page mb-3">
        <div className="grid grid-cols-1 md:grid-cols-6">
          <div className="col-span-12 md:col-span-1">
            <DataInfo label="No. Referensi" value={row?.noReferensi} />
          </div>
          <div className="col-span-12 md:col-span-1">
            <DataInfo label="Admin User" value={row?.pengguna?.fullName} />
          </div>
          <div className="col-span-12 md:col-span-1">
            <DataInfo label="Supplier" value={row?.supplier ? row?.supplier : "-"} />
          </div>
          <div className="col-span-12 md:col-span-1">
            <DataInfo label="Name" value={row?.name} />
          </div>
          <div className="col-span-12 md:col-span-1">
            <DataInfo label="Type" value={<TransactionType />} />
          </div>
          <div className="col-span-12 md:col-span-1">
            <DataInfo label="Status" value={<span className="uppercase">{row?.status}</span>} />
          </div>
        </div>

        <hr className="my-4" />

        <div className="overflow-x-auto md:overflow-hidden">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="th-table text-left">Sparepart</th>
                <th className="th-table w-auto md:w-36">Jumlah</th>
                <th className="th-table w-auto md:w-52 text-right">Harga</th>
              </tr>
            </thead>
            <tbody>
              {row?.sparepartDetail?.map((sparepart, index) => (
                <tr className="tr-table" key={index}>
                  <td className="td-table">{sparepart?.sparepart}</td>
                  <td className="border px-2 text-center">{sparepart?.transaksispareparthubs?.jumlah}</td>
                  <td className="border px-2 text-right">
                    <div className="flex justify-end gap-1 w-full">
                      <span className="hidden md:block">Rp.</span>
                      <span>{idrNumber(sparepart?.transaksispareparthubs?.harga)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  )
}

const DataInfo = ({ label, value, hideLabel = false }) => {
  return (
    <div className="flex flex-row md:flex-col justify-between md:justify-start md:gap-y-1 mb-2">
      <div className={`${hideLabel ? 'hidden md:block' : ''} w-32`}>
        <label className="text-gray-600 text-sm">{label}</label>
      </div>
      <div>
        <h5 className="text-sm font-semibold text-gray-700">{value}</h5>
      </div>
    </div>
  )
}

export default Detail