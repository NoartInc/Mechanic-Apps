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
import { randId } from "../../../../utils/helper";
import SelectInput from "../../../../components/widgets/SelectInput";
import InputForm from "../../../../components/widgets/InputForm";
import { type, status } from ".";
import SparepartOption from "../../../../components/widgets/SparepartOption";
import { IconTrash } from "@tabler/icons";

// Setup validasi form
const validationSchema = Yup.object().shape({
  noReferensi: Yup.string().required("Wajib diisi!"),
  name: Yup.string().required("Wajib diisi!"),
  type: Yup.string().required("Wajib diisi!"),
  status: Yup.string().required("Wajib diisi!"),
});

const Edit = () => {
  const { id } = useRouter()?.query;
  const context = "Mekanik";
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [sparepartHubs, setSparepartHubs] = React.useState([
    {
      id: randId(),
      sparepart: 0,
      jumlah: 0,
      harga: 0,
    },
  ]);

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
      put(`${apiUrl}/${id}`, {
        ...values,
        sparepartHubs: sparepartHubs,
      })
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

  const onSparepartChange = (item, name, value) => {
    const updatedSparepart = sparepartHubs.map((val) => {
      if (val.id === item.id) {
        return {
          ...val,
          [name]: value,
        };
      }
      return val;
    });
    setSparepartHubs(updatedSparepart);
  };

  const addSparepart = () => {
    setSparepartHubs((prevState) => [
      ...prevState,
      {
        id: randId(),
        sparepart: 0,
        jumlah: 0,
        harga: 0,
      },
    ]);
  };

  const removeSparepart = (id) => {
    const updatedSparepart = sparepartHubs.filter(
      (item) => String(item?.id) !== String(id)
    );
    setSparepartHubs(updatedSparepart);
  };

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
          });
          setSparepartHubs(result?.sparepartHubs);
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
  }, [id]);

  return (
    <Layout title={`Edit ${context}`}>
      <div className="card-page">
        <form onSubmit={form.handleSubmit}>
          <div>
            <TextInput form={form} label="No Referensi" name="noReferensi" />
            {form.values.type === "in" && (
              <TextInput form={form} label="Supplier" name="supplier" />
            )}
            <TextInput form={form} label="Name" name="name" />
            <SelectInput form={form} label="Type" name="type" options={type} />
            <SelectInput
              form={form}
              label="Status"
              name="status"
              options={status}
            />
            <hr />
            <fieldset className="border border-gray-200 rounded">
              <legend className="p-2 ml-3">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={addSparepart}
                >
                  Tambah
                </button>
              </legend>
              <div className="px-3">
                <table className="table auto w-full">
                  <tbody>
                    {sparepartHubs?.map((detail, index) => (
                      <tr key={detail?.id}>
                        <td className="p-2">
                          <SparepartOption
                            label="Sparepart"
                            name="sparepart"
                            onChange={(value) =>
                              onSparepartChange(detail, "sparepart", value)
                            }
                            value={detail?.sparepart}
                          />
                        </td>
                        {form.values.type === "in" && (
                          <td className="p-2" style={{ width: 200 }}>
                            <InputForm
                              label="Harga"
                              name="harga"
                              onChange={(event) =>
                                onSparepartChange(
                                  detail,
                                  event.target.name,
                                  event.target.value
                                )
                              }
                              type="number"
                              value={detail?.harga}
                              placeholder="Harga Sparepart"
                            />
                          </td>
                        )}
                        <td className="p-2" style={{ width: 150 }}>
                          <InputForm
                            label="Kuantitas"
                            name="jumlah"
                            onChange={(event) =>
                              onSparepartChange(
                                detail,
                                event.target.name,
                                Number(event.target.value)
                              )
                            }
                            type="number"
                            value={detail?.jumlah}
                            placeholder="Kuantitas"
                          />
                        </td>
                        <td className="p-2" style={{ width: 80 }}>
                          {index > 0 && (
                            <button
                              type="button"
                              className="mt-8 button button-danger"
                              onClick={() => removeSparepart(detail?.id)}
                            >
                              <IconTrash />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>
          </div>
          <div className="card-page-footer">
            <BackButton />
            <SubmitButton loading={loading} />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Edit;
