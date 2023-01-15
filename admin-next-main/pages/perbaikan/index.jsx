import moment from "moment/moment";
import React from "react";
import Layout from "../../components/layouts/Layout";
import DataTable from "../../components/widgets/DataTable";
import { useData } from "../../utils/hooks/useData";
import DropdownOption from "../../components/widgets/DropdownOption";
import { patch } from "../../utils/api";
import { Toast } from "../../utils/swal";

const title = "Perbaikan";
const pageUrl = "/perbaikan";
export const apiUrl = "/perbaikan";

export const statusList = [
  {
    status: "open",
    className: "bg-green-500 text-white"
  },
  {
    status: "revisi",
    className: "bg-yellow-500 text-white"
  },
  {
    status: "reject",
    className: "bg-red-500 text-white"
  },
  {
    status: "accept",
    className: "bg-blue-500 text-white"
  }
]

const Perbaikan = () => {
  const data = useData(apiUrl);
  const columns = [
    {
      name: "noLaporan",
      title: "No. ",
      style: {
        minWidth: 140
      }
    },
    {
      name: "machine",
      title: "Mesin",
      render: ({ value }) => (
        <span>{value?.mesin ?? "-"}</span>
      )
    },
    {
      name: "jenisPerbaikan",
      title: "Jenis",
      render: ({ value }) => {
        return value?.toUpperCase();
      }
    },
    {
      name: "createdAt",
      title: "Tanggal",
      style: {
        width: 140
      },
      render: ({ value }) => moment(value).format("DD/MM/YYYY")
    },
    {
      name: "status",
      title: "Status",
      className: "text-center",
      style: {
        width: 140
      },
      render: ({ value, item: data }) => (
        <DropdownOption text={value} className={`uppercase ${getStatusColor(value)}`}>
          <>
            {statusList.map((item, index) => (
              <button
                key={index}
                type="button"
                className="dropdown-option-item uppercase"
                onClick={() => updateStatus(data, item?.status)}
              >
                {item?.status}
              </button>
            ))}
          </>
        </DropdownOption>
      )
    },
  ];

  const getStatusColor = (status) => {
    return statusList.find(item => item?.status === status)?.className;
  }

  const updateStatus = (item, status) => {
    patch(`${apiUrl}/status/${item?.id}`, {
      status: status
    }).then(result => {
      if (result?.status) {
        Toast.fire({
          icon: "success",
          text: "Status updated"
        });
        data.getList();
      }
    }).catch(error => {
      Toast.fire({
        icon: "error",
        text: "Status failed to updated!"
      })
    })
  }

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

export default Perbaikan;
