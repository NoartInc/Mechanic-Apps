import moment from "moment/moment";
import React from "react";
import Layout from "../../components/layouts/Layout";
import DataTable from "../../components/widgets/DataTable";
import { useData } from "../../utils/hooks/useData";
import DropdownOption from "../../components/widgets/DropdownOption";
import { patch } from "../../utils/api";
import { Toast } from "../../utils/swal";
import { useAccess } from "../../utils/hooks/useAccess";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons";
import Modal from "../../components/widgets/Modal";

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
  const { canAccess } = useAccess("/perbaikan");
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
      render: ({ value, item: data }) => {
        if (!canAccess("update")) {
          return (
            <span className={`p-1 px-2 rounded-md ${getStatusColor(value)} uppercase`}>
              {value}
            </span>
          )
        }
        return (
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
      }
    },
    {
      name: "uploadPhotos",
      title: "Photo",
      className: "text-center",
      style: {
        width: 80
      },
      render: ({ value }) => {
        if (!value) {
          return (
            <button type="button" className="button button-dark button-xsmall">
              <IconUpload size={16} />
              <span>Upload</span>
            </button>
          )
        }
        return (
          <div className="flex items-center">
            <button type="button" className="button button-primary button-xsmall">
              <IconPhoto size={16} />
              <span>Lihat</span>
            </button>
            <button type="button" className="button button-danger button-xsmall">
              <IconTrash size={20} />
            </button>
          </div>
        )
      }
    }
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
      {/* <Modal /> */}
    </Layout>
  );
};

export default Perbaikan;
