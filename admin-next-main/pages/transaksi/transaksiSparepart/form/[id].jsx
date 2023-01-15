import React from "react";
import Layout from "../../../../components/layouts/Layout";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { apiUrl } from "..";
import BackButton from "../../../../components/widgets/BackButton";
import SubmitButton from "../../../../components/widgets/SubmitButton";
import TextInput from "../../../../components/widgets/TextInput";
import { useFormik } from "formik";
import { get, put } from "../../../../utils/api";
import { Toast } from "../../../../utils/swal";
import SelectInput from "../../../../components/widgets/SelectInput";
import { type, status, SparepartHubs } from ".";

// Setup validasi form
const validationSchema = Yup.object().shape({
  noReferensi: Yup.string().required("Wajib diisi!"),
  name: Yup.string().required("Wajib diisi!"),
  type: Yup.string().required("Wajib diisi!"),
  status: Yup.string().required("Wajib diisi!"),
});

const Edit = () => {
  const { id } = useRouter()?.query;
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
      put(`${apiUrl}/${id}`, values)
        .then((result) => {
          if (result?.data?.id) {
            Toast.fire({
              icon: "success",
              text: result?.message,
            }).then(() => {
              router.back();
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

  const getRow = () => {
    get(`${apiUrl}/${id}`)
      .then((result) => {
        if (result?.id) {
          form.setValues({
            noReferensi: result?.noReferensi,
            supplier: result?.supplier,
            name: result?.name,
            type: result?.type,
            status: result?.status,
            sparepartHubs: result?.sparepartDetail?.map(item => ({
              id: item?.id,
              sparepart: item?.id,
              label: item?.sparepart,
              jumlah: Number(item?.transaksispareparthubs?.jumlah),
              harga: Number(item?.transaksispareparthubs?.harga),
            }))
          });
        }
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          text: "Data tidak ditemukan!",
        });
      });
  };

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

  React.useEffect(() => {
    getRow();
    // eslint-disable-next-line
  }, [id]);

  return (
    <Layout title={`Edit ${context}`}>
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

export default Edit;
