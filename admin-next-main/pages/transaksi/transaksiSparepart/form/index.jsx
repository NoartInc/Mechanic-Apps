import React from "react";
import Layout from "../../../../components/layouts/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../../../../components/widgets/TextInput";
import BackButton from "../../../../components/widgets/BackButton";
import SubmitButton from "../../../../components/widgets/SubmitButton";
import { post } from "../../../../utils/api";
import { apiUrl } from "..";
import { Toast } from "../../../../utils/swal";
import { useRouter } from "next/router";
import SelectInput from "../../../../components/widgets/SelectInput";
import SparepartOption from "../../../../components/widgets/SparepartOption";
import { randId } from "../../../../utils/helper";
import { IconPlus, IconTrash } from "@tabler/icons";

// Setup validasi form
const validationSchema = Yup.object().shape({
  noReferensi: Yup.string().required("Wajib diisi!"),
  name: Yup.string().required("Wajib diisi!"),
  type: Yup.string().required("Wajib diisi!"),
  status: Yup.string().required("Wajib diisi!"),
});

export const status = [
  {
    value: "update",
    label: "Update",
  },
  {
    value: "adjust",
    label: "Adjust",
  },
];

export const type = [
  {
    value: "in",
    label: "IN",
  },
  {
    value: "out",
    label: "OUT",
  },
];

const Add = () => {
  const context = "Transaksi Sparepart";
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      noReferensi: "",
      supplier: "",
      name: "",
      type: "",
      status: "",
      sparepartHubs: [],
    },
    onSubmit: (values) => {
      setLoading(true);
      post(apiUrl, values)
        .then((result) => {
          if (result?.data?.id) {
            Toast.fire({
              icon: "success",
              text: result?.message,
            }).then(() => {
              router.push("/transaksi/transaksiSparepart")
            });
          }
        })
        .catch((error) => {
          Toast.fire({
            icon: "error",
            text: "Gagal menyimpan data",
            timer: 5000,
          });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    },
  });

  const formSubmit = (event) => {
    event.preventDefault();
    if (!form.values?.sparepartHubs.length) {
      Toast.fire({
        icon: "error",
        text: "Mohon tambahkan sparepart!"
      });
      return false;
    } else if (form.values.type === "in") {
      if (form.values?.sparepartHubs?.some(item => item?.jumlah === 0 || item?.harga === 0)) {
        Toast.fire({
          icon: "error",
          text: "Harga atau jumlah tidak boleh kosong!"
        });
        return false;
      } else {
        form.handleSubmit(event);
      }
    } else {
      form.handleSubmit(event);
    }
  }

  return (
    <Layout title={`Tambah ${context}`}>
      <form onSubmit={formSubmit}>
        <div className="card-page mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 w-full md:w-2/5">
              <TextInput form={form} label="No Referensi" name="noReferensi" />
              <SelectInput form={form} label="Type" name="type" options={type} />
              <SelectInput
                form={form}
                label="Status"
                name="status"
                options={status}
              />
            </div>
            <div className="flex-grow">{/* Separator Column Tengah */}</div>
            <div className="flex-shrink-0 w-full md:w-2/5">
              {form.values.type === "in" && (
                <TextInput form={form} label="Supplier" name="supplier" />
              )}
              <TextInput form={form} label="Name" name="name" />
            </div>
          </div>
        </div>
        <h4 className="text-xl font-bold mb-2">Detail Sparepart</h4>
        <div className="card-page mb-4">
          <SparepartHubs form={form} />
        </div>
        <div className="card-page">
          <div className="flex justify-between items-center">
            <BackButton />
            <SubmitButton loading={loading} />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export const SparepartHubs = ({ form }) => {
  const [selectedSparepart, setSelectedSparepart] = React.useState(null);

  const onSparepartChange = (data) => {
    setSelectedSparepart(data);
  }

  const addSparepart = () => {
    // Cek jika sparepart (sudah ada / belum)
    if (!form.values.sparepartHubs.some(item => item?.sparepart === selectedSparepart?.value)) {
      const updatedList = [...form.values.sparepartHubs, {
        id: randId(),
        sparepart: selectedSparepart?.value,
        label: selectedSparepart?.label,
        stok: selectedSparepart?.stok,
        jumlah: 0,
        harga: 0,
      }];
      if (!selectedSparepart) {
        Toast.fire({
          icon: "error",
          text: "Mohon pilih sparepart!"
        });
      } else {
        form.setFieldValue("sparepartHubs", updatedList);
        setSelectedSparepart(null);
      }
    } else {
      Toast.fire({
        icon: "error",
        text: `Sparepart ${selectedSparepart?.label} sudah ada!`
      });
    }
  };

  const onFieldChange = (event, index) => {
    const { name, value } = event.target;

    if (name === "jumlah" && form.values.type === "out" && value > form.values.sparepartHubs[index]["stok"]) {
      Toast.fire({
        icon: "error",
        text: `Stok yang tersedia adalah ${form.values.sparepartHubs[index]["stok"]} !`
      });
      return false;
    }

    form.setFieldValue(`sparepartHubs[${index}]['${name}']`, Number(value))
  }

  const removeSparepart = (id) => {
    const updatedList = form.values.sparepartHubs.filter(item => item?.id !== id);
    form.setFieldValue("sparepartHubs", updatedList);
  };

  return (
    <fieldset className="border border-gray-200 rounded">
      <legend className="p-2 ml-3">
        <div className="flex gap-x-2 items-center">
          <div style={{ width: 200 }}>
            <SparepartOption
              noLabel
              name="sparepart"
              onChange={onSparepartChange}
              value={selectedSparepart}
            />
          </div>
          <button type="button" className="button button-primary" onClick={addSparepart} style={{ width: 50 }}>
            <IconPlus />
          </button>
        </div>
      </legend>

      <div className="md:px-3 overflow-x-auto max-w-max md:max-w-full">
        {!form.values.sparepartHubs?.length ? (
          <div className="p-3 flex justify-center items-center mb-3">
            <h4 className="text-lg mb-2">Belum ada sparepart</h4>
          </div>
        ) : (
          <div className="relative overflow-x-auto mb-3 overflow-y-auto flex-grow data-table-content rounded">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="th-table text-left">Sparepart</th>
                  {form.values.type === "in" && (
                    <th className="th-table text-right" style={{ width: 200 }}>Harga</th>
                  )}
                  <th className="th-table" style={{ width: 100 }}>Kuantitas</th>
                  <th className="th-table" style={{ width: 50 }}>&times;</th>
                </tr>
              </thead>
              <tbody>
                {form.values.sparepartHubs?.map((detail, index) => (
                  <tr className="tr-table" key={detail?.id}>
                    <td className="td-table">{detail?.label}</td>
                    {form.values.type === "in" && (
                      <td className="td-table text-right">
                        <input
                          type="number"
                          className="text-input text-right"
                          name={`harga`}
                          id={`harga_${detail?.id}`}
                          value={detail?.harga}
                          onChange={(event) => onFieldChange(event, index)}
                        />
                      </td>
                    )}
                    <td className="td-table text-center">
                      <input
                        type="number"
                        className="text-input text-center"
                        name={`jumlah`}
                        id={`jumlah_${detail?.id}`}
                        value={detail?.jumlah}
                        min={1}
                        onChange={(event) => onFieldChange(event, index)}
                      />
                    </td>
                    <td className="td-table">
                      <button
                        type="button"
                        className="button button-danger button-small"
                        onClick={() => removeSparepart(detail?.id)}
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </fieldset>
  )
}

export default Add;
