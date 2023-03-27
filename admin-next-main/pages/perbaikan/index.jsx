import moment from "moment/moment";
import React from "react";
import Layout from "../../components/layouts/Layout";
import DataTable from "../../components/widgets/DataTable";
import { useData } from "../../utils/hooks/useData";
import DropdownOption from "../../components/widgets/DropdownOption";
import { baseUrl, patch } from "../../utils/api";
import { Toast } from "../../utils/swal";
import { useAccess } from "../../utils/hooks/useAccess";
import { IconPhoto, IconTrash, IconUpload } from "@tabler/icons";
import ModalUpload from "../../components/widgets/ModalUpload";
import Swal from "sweetalert2";
import ImagePreview from "../../components/widgets/ImagePreview";
import { useSelector } from "react-redux";
import DataFilter from "../../components/widgets/DataFilter";
import DateRangeFilter from "../../components/widgets/DateRangeFilter";
import Link from "next/link";
import DataExport from "../../components/widgets/DataExport";
import useExport from "../../utils/hooks/useExport";

const title = "Perbaikan";
const pageUrl = "/perbaikan";
export const apiUrl = "/perbaikan";

export const statusList = [
  {
    status: "open",
    className: "bg-green-500 text-white",
    visibility: "ADMINISTRATOR, MEKANIK"
  },
  {
    status: "proses",
    className: "bg-blue-500 text-white",
    visibility: "ADMINISTRATOR, MEKANIK"
  },
  {
    status: "revisi",
    className: "bg-yellow-500 text-white",
    visibility: "MEKANIK, ADMINISTRATOR"
  },
  {
    status: "reject",
    className: "bg-red-500 text-white",
    visibility: "LO, ADMINISTRATOR"
  },
  {
    status: "accept",
    className: "bg-gray-500 text-white",
    visibility: "LO, ADMINISTRATOR"
  }
]

const Perbaikan = () => {
  const data = useData(apiUrl);
  const exportData = useExport(`/export${apiUrl}`);
  const { canAccess } = useAccess("/perbaikan");
  const uploadRef = React.useRef(null);
  const previewRef = React.useRef(null);
  const { user } = useSelector(state => state.auth)
  const [selectedItem, setSelectedItem] = React.useState(null);
  const columns = [
    {
      name: "noLaporan",
      title: "No. ",
      style: {
        minWidth: 140
      },
      render: ({ value, item }) => (
        <Link href={`${pageUrl}/${item?.id}`} className="text-base font-medium text-gray-600 hover:text-blue-700">
          {value}
        </Link>
      )
    },
    {
      name: "mesin",
      title: "Mesin",
      render: ({ item }) => (
        <span>{item?.machine?.mesin ?? "-"}</span>
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
        if (!canAccess("update") || (value === "accept" && user?.userRole?.roleName !== "ADMINISTRATOR")) {
          return (
            <span className={`p-1 px-2 rounded-md ${getStatusColor(value)} uppercase`}>
              {value}
            </span>
          )
        }
        return (
          <DropdownOption text={value} className={`uppercase ${getStatusColor(value)}`}>
            <>
              {getStatusList().map((item, index) => (
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
      render: ({ value, item }) => {
        if (value) {
          return (
            <ViewFile
              withRemove={canAccess("update")}
              onRemove={() => removeFile(item)}
              onPreview={() => previewImage(item)}
            />
          )
        } else {
          return (
            <UploadButton
              onClick={() => uploadFile(item)}
              canUpload={canAccess("update")}
            />
          )
        }
      }
    }
  ];

  const getStatusList = () => {
    if (statusList?.some(item => item?.visibility === user?.userRole?.roleName)) {
      return statusList?.filter(item => item?.visibility === user?.userRole?.roleName);
    } else {
      return statusList;
    }
  }

  const removeFile = (item) => {
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Tidak Jadi",
      title: `Konfirmasi`,
      text: `Hapus file ${item?.uploadPhotos} ?`
    }).then(result => {
      if (result.isConfirmed) {
        patch(`${apiUrl}/remove/photo/${item?.id}`)
          .then(res => {
            if (res?.status) {
              Toast.fire({
                icon: "info",
                text: `File ${item?.uploadPhotos} dihapus!`,
                timer: 1000
              }).then(() => {
                data.getList();
              });
            }
          });
      }
    })
  }

  const uploadFile = (item) => {
    setSelectedItem(item);
    uploadRef.current.openUpload();
  }

  const previewImage = (item) => {
    setSelectedItem(item);
    previewRef.current.openModal();
  }

  const onUploadSuccess = () => {
    setSelectedItem(null);
    data.getList();
  }

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
        filterData={(
          <DataFilter onApply={() => data.applyFilter()}>
            <DateRangeFilter onChange={(filter) => data.setFilter(filter)} value={data.filters?.dateRange} />
          </DataFilter>
        )}
        actionButton={(
          <DataExport onApply={() => exportData.downloadData()}>
            <DateRangeFilter onChange={(filter) => exportData.onFilterChange(filter)} value={exportData.filters?.dateRange} />
          </DataExport>
        )}
      />
      
      <ModalUpload
        ref={uploadRef}
        method="patch"
        uploadUrl={`${apiUrl}/upload/photo/${selectedItem?.id}`}
        name="uploadPhotos"
        onSuccess={onUploadSuccess}
      />
      <ImagePreview ref={previewRef} source={`${baseUrl}/images/${selectedItem?.uploadPhotos}`} />
    </Layout>
  );
};

const UploadButton = ({ onClick, canUpload }) => {
  const onUploadClick = () => {
    if (canUpload) {
      onClick();
    } else {
      Swal.fire({
        showConfirmButton: false,
        timer: 3000,
        text: "Anda tidak punya akses untuk upload",
        title: "Info",
        icon: "info"
      });
    }
  }
  return (
    <button
      type="button"
      className="button button-dark button-xsmall"
      onClick={onUploadClick}
    >
      <IconUpload size={16} />
      <span>Upload</span>
    </button>
  )
}

export const ViewFile = ({ withRemove = true, onRemove, onPreview }) => {
  return (
    <div className="flex items-center">
      <button type="button" className="button button-primary button-xsmall" onClick={onPreview}>
        <IconPhoto size={16} />
        <span>Lihat</span>
      </button>
      {withRemove && (
        <button type="button" className="button button-danger button-xsmall" onClick={onRemove}>
          <IconTrash size={20} />
        </button>
      )}
    </div>
  )
}

export default Perbaikan;
