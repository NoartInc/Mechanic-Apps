import React from 'react'
import Layout from '../../../components/layouts/Layout'
import { useFormik } from 'formik';
import * as Yup from "yup";
import TextInput from '../../../components/widgets/TextInput';
import BackButton from '../../../components/widgets/BackButton';
import SubmitButton from '../../../components/widgets/SubmitButton';
import { get, post } from '../../../utils/api';
import { apiUrl } from '..';
import { Toast } from '../../../utils/swal';
import { useRouter } from 'next/router';
import SelectInput from '../../../components/widgets/SelectInput';
import MachineOption from '../../../components/widgets/MachineOption';
import MechanicOption from '../../../components/widgets/MechanicOption';
import TextareaInput from '../../../components/widgets/TextareaInput';
import moment from 'moment';
import { randId } from '../../../utils/helper';
import GudangMekanikOption from '../../../components/widgets/GudangMekanikOption';
import InputForm from '../../../components/widgets/InputForm';
import { IconTrash } from '@tabler/icons';

// Setup validasi form
const validationSchema = Yup.object().shape({
  mesin: Yup.number().required("Wajib diisi!"),
  startDate: Yup.string().required("Wajib diisi!"),
  jenisPerbaikan: Yup.string().required("Mohon pilih jenis perbaikan").oneOf(["repairment", "maintenance"])
});

export const jenisPerbaikan = [
  {
    value: "repairment",
    label: "Repairment"
  },
  {
    value: "maintenance",
    label: "Maintenance"
  }
];

const Add = () => {
  const context = "Perbaikan";
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [spareparts, setSpareparts] = React.useState([]);
  const [kerusakans, setKerusakans] = React.useState([]);

  const form = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      mesin: undefined,
      user: null,
      startDate: moment().format("YYYY-MM-DD HH:mm"),
      endDate: null,
      note: "",
      jenisPerbaikan: undefined,
      perbaikanMekaniks: undefined,
      perbaikanSpareparts: [],
      perbaikanKerusakans: []
    },
    onSubmit: (values) => {
      setLoading(true);
      post(apiUrl, {
        ...values,
        perbaikanSpareparts: spareparts,
        perbaikanKerusakans: kerusakans
      })
        .then(result => {
          if (result?.data?.id) {
            Toast.fire({
              icon: "success",
              text: result?.message
            }).then(() => {
              router.back();
            })
          }
        })
        .catch(error => {
          Toast.fire({
            icon: "error",
            text: "Gagal menyimpan data",
            timer: 5000
          });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
    }
  });
  return (
    <Layout title={`Tambah ${context}`}>
      <div className="card-page">
        <form onSubmit={form.handleSubmit}>
          <div>

            {/* Main Data */}
            <div className="flex justify-start md:justify-between flex-col md:flex-row">
              <div className="flex-shrink-0 w-full md:w-2/4">
                <SelectInput
                  form={form}
                  name="jenisPerbaikan"
                  options={jenisPerbaikan}
                  label="Jenis"
                />
                <MachineOption
                  label="Mesin"
                  name="mesin"
                  value={form.values.mesin}
                  onChange={(value) => form.setFieldValue("mesin", value)}
                />
                <MechanicOption
                  label="Mekanik"
                  name="perbaikanMekaniks"
                  value={form.values.perbaikanMekaniks}
                  onChange={(value) => form.setFieldValue("perbaikanMekaniks", value)}
                />
              </div>
              <div className="flex-grow"></div>
              <div className="flex-shrink-0 w-full md:w-1/3">
                <TextareaInput form={form} label="Note" name="note" placeholder="Catatan singkat." />
              </div>
            </div>
            <hr />

            {/* Detail Sparepart */}
            <h4 className="text-lg mt-3">Detail Sparepart</h4>
            <DetailSparepart setSpareparts={setSpareparts} spareparts={spareparts} />

            {/* Detail Kerusakan */}
            <hr className="mt-8" />
            <h4 className="text-lg mt-3">Detail Kerusakan</h4>
            <DetailKerusakan setKerusakans={setKerusakans} kerusakans={kerusakans} />

          </div>
          <div className="card-page-footer">
            <BackButton />
            <SubmitButton loading={loading} />
          </div>
        </form>
      </div>
    </Layout>
  )
}

const DetailSparepart = ({ spareparts, setSpareparts }) => {
  const [list, setList] = React.useState([]);

  const addSparepart = () => {
    setList(prevState => [...prevState, {
      id: randId(),
      gudangmekanik: "",
      jumlah: 0,
      stok: 0
    }]);
  }

  const removeSparepart = (id) => {
    const updatedList = list.filter(item => item?.id !== id);
    setList(updatedList);
  }

  const onSparepartChange = (id, name, value, inputItem = null) => {
    const updatedList = list.map(item => {
      if (item?.id === id) {
        const stok = inputItem ? inputItem?.stok : item?.stok;
        return {
          ...item,
          [name]: value,
          stok: stok
        }
      }
      return item;
    });
    setList(updatedList);
  }

  React.useEffect(() => {
    setSpareparts(list);
  }, [list]);

  return (
    <fieldset className="border border-gray-200 rounded">
      <legend className="p-2 ml-3">
        <button type="button" className="button button-primary" onClick={addSparepart}>Tambah Sparepart</button>
      </legend>
      <div className="px-3">
        {!spareparts?.length ? (
          <div className="p-3 flex justify-center items-center mb-3">
            <h4 className="text-lg">Belum ada sparepart</h4>
          </div>
        ) : (
          <div>
            <table className="table auto w-full">
              <tbody>
                {spareparts?.map((detail, index) => (
                  <tr key={detail?.id}>
                    <td className="p-2">
                      <GudangMekanikOption
                        label="Sparepart"
                        name="gudangmekanik"
                        onChange={(value, item) => onSparepartChange(detail?.id, "gudangmekanik", value, item)}
                        value={detail?.gudangmekanik}
                      />
                    </td>
                    <td className="p-2" style={{ width: 150 }}>
                      <InputForm
                        label="Stok"
                        name="stok"
                        value={detail?.stok}
                        disabled={true}
                      />
                    </td>
                    <td className="p-2" style={{ width: 150 }}>
                      <InputForm
                        label="Kuantitas"
                        name="jumlah"
                        onChange={(event) =>
                          onSparepartChange(
                            detail?.id,
                            event.target.name,
                            Number(event.target.value)
                          )
                        }
                        value={detail?.jumlah}
                        type="number"
                        placeholder="Kuantitas"
                      />
                    </td>
                    <td className="p-2" style={{ width: 80 }}>
                      <button
                        type="button"
                        className="mt-8 button button-danger"
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

const DetailKerusakan = ({ kerusakans, setKerusakans }) => {
  return (
    <fieldset className="border border-gray-200 rounded mb-3">
      <legend className="p-2 ml-3">
        <button type="button" className="button button-primary">Tambah Kerusakan</button>
      </legend>
      <div className="px-3">
        {!kerusakans?.length ? (
          <div className="p-3 flex justify-center items-center mb-3">
            <h4 className="text-lg">Belum ada kerusakan</h4>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </fieldset>
  )
}

export default Add