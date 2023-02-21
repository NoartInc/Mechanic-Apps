import React from 'react'
import Layout from '../../../components/layouts/Layout'
import { useFormik } from 'formik';
import * as Yup from "yup";
import TextInput from '../../../components/widgets/TextInput';
import BackButton from '../../../components/widgets/BackButton';
import SubmitButton from '../../../components/widgets/SubmitButton';
import { post } from '../../../utils/api';
import { apiUrl } from '..';
import { Toast } from '../../../utils/swal';
import { useRouter } from 'next/router';
import SelectInput from '../../../components/widgets/SelectInput';
import MachineOption from '../../../components/widgets/MachineOption';
import MechanicOption from '../../../components/widgets/MechanicOption';
import TextareaInput from '../../../components/widgets/TextareaInput';
import moment from 'moment';
import { getTimeDiff, getTimeDuration, randId } from '../../../utils/helper';
import GudangMekanikOption from '../../../components/widgets/GudangMekanikOption';
import { IconPlus, IconTrash } from '@tabler/icons';
import KerusakanOption from '../../../components/widgets/KerusakanOption';
import ReadOnlyInput from '../../../components/widgets/ReadOnlyInput';
import { durationTemplate } from '../../../components/widgets/DurationInput';

// Setup validasi form
const validationSchema = Yup.object().shape({
  mesin: Yup.number().required("Wajib diisi!"),
  startDate: Yup.string().required("Wajib diisi!"),
  jenisPerbaikan: Yup.string().required("Mohon pilih jenis perbaikan").oneOf(["repairment", "maintenance"])
});

export const getKerusakanDuration = (listKerusakan, listPerbaikanKerusakans = null) => {
  return listKerusakan?.reduce((acc, cur) => {
    const jumlah = !listPerbaikanKerusakans ? 1 : listPerbaikanKerusakans?.find(item => 
      item?.kerusakan === cur?.id)?.jumlah;
    return acc += cur?.durasi_in_seconds * jumlah;
  }, 0);
}

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

  const form = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      mesin: "",
      user: null,
      startDate: moment().format("YYYY-MM-DD HH:mm"),
      endDate: "",
      note: "",
      jenisPerbaikan: "",
      perbaikanMekaniks: [],
      perbaikanSpareparts: [],
      perbaikanKerusakans: []
    },
    onSubmit: (values) => {
      setLoading(true);
      post(apiUrl, {
        ...values,
        endDate: values?.endDate === "" ? null : values?.endDate,
        perbaikanSpareparts: values.perbaikanSpareparts.map(item => ({
          gudangmekanik: item?.gudangmekanik,
          jumlah: item?.jumlah
        })),
        perbaikanKerusakans: values.perbaikanKerusakans.map(item => ({
          kerusakan: item?.kerusakan,
          jumlah: item?.jumlah
        }))
      })
        .then(result => {
          if (result?.data?.id) {
            Toast.fire({
              icon: "success",
              text: result?.message,
              timer: 500
            }).then(() => {
              router.push("/perbaikan")
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

  const formSubmit = (event) => {
    event.preventDefault();
    if (!form.values?.perbaikanMekaniks.length) {
      Toast.fire({
        icon: "error",
        text: "Pilih Mekanik!"
      });
      return false;
    } else if (!form.values?.perbaikanKerusakans.length) {
      Toast.fire({
        icon: "error",
        text: "Mohon tambahkan kerusakan!"
      });
      return false;
    } else {
      form.handleSubmit(event);
    }
  }

  return (
    <Layout title={`Tambah ${context}`}>
      <form onSubmit={formSubmit}>
        <div>
          <div className="card-page mb-6">

            {/* Main Data */}
            <div className="flex justify-start md:justify-between flex-col md:flex-row">
              <div className="flex-shrink-0 w-full md:w-2/5">
                <SelectInput
                  form={form}
                  name="jenisPerbaikan"
                  options={jenisPerbaikan}
                  label="Jenis Perbaikan"
                />
                <MachineOption
                  label="Nama Mesin"
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
          </div>

          {/* Detail Sparepart */}
          <h4 className="text-xl font-bold mb-2">Detail Sparepart</h4>
          <div className="card-page mb-6">
            <DetailSparepart form={form} />
          </div>
          {/* End Detail Sparepart */}

          {/* Detail Kerusakan */}
          <h4 className="text-xl font-bold mb-2">Detail Kerusakan</h4>
          <div className="card-page mb-6">
            <div className="flex justify-start md:justify-between flex-col md:flex-row">
              <div className="flex-shrink-0 w-full md:w-2/5">
                <TextInput
                  form={form}
                  name="startDate"
                  label="Mulai Perbaikan"
                  type="datetime-local"
                />
                <TextInput
                  form={form}
                  name="endDate"
                  label="Selesai Perbaikan"
                  type="datetime-local"
                  min={moment(form.values.startDate).add("2 minutes").format("YYYY-MM-DD HH:mm")}
                />
              </div>
              <div className="flex-grow">{/* Separator Kolom Tengah */}</div>
              <div className="flex-shrink-0 w-full md:w-1/3">
                {form.values.jenisPerbaikan !== "maintenance" && (
                  <ReadOnlyInput label="Downtime" value={getTimeDiff(form.values.startDate, form.values.endDate)} />
                )}
                <ReadOnlyInput label="Estimasi" value={getTimeDuration(getKerusakanDuration(form.values.perbaikanKerusakans))} />
              </div>
            </div>
            <DetailKerusakan form={form} />
          </div>
          {/* End Detail Kerusakan */}

          <div className="card-page">
            <div className="flex justify-between items-center">
              <BackButton />
              <SubmitButton loading={loading} />
            </div>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export const DetailSparepart = ({ form }) => {
  const [selectedGudangMekanik, setSelectedGudangMekanik] = React.useState(null);

  const onGudangMekanikChange = (data) => {
    setSelectedGudangMekanik(data);
  }

  const addSparepart = () => {
    // Cek jika sparepart (sudah ada / belum)
    if (!form.values.perbaikanSpareparts.some(item => item?.gudangmekanik === selectedGudangMekanik?.value)) {
      const updatedList = [...form.values.perbaikanSpareparts, {
        id: randId(),
        sparepart: selectedGudangMekanik?.label,
        gudangmekanik: selectedGudangMekanik?.value,
        stok: selectedGudangMekanik?.stok,
        jumlah: 0
      }];
      if (!selectedGudangMekanik) {
        Toast.fire({
          icon: "error",
          text: "Mohon pilih sparepart!"
        });
      } else {
        form.setFieldValue("perbaikanSpareparts", updatedList);
        setSelectedGudangMekanik(null);
      }
    } else {
      Toast.fire({
        icon: "error",
        text: `Sparepart ${selectedGudangMekanik?.label} sudah ada!`
      });
    }
  }

  const onJumlahChange = (event, index) => {
    const { value } = event.target;
    const stok = form.values.perbaikanSpareparts[index]['stok'];
    if (value > stok) {
      Toast.fire({
        icon: "error",
        text: `Stok yang tersedia adalah ${stok}!`
      });
    } else if (value < 1) {
      Toast.fire({
        icon: "error",
        text: `Minimal jumlah adalah 1!`
      });
    } else {
      form.setFieldValue(`perbaikanSpareparts[${index}]['jumlah']`, Number(value))
    }
  }

  const removeSparepart = (id) => {
    const updatedList = form.values.perbaikanSpareparts.filter(item => item?.id !== id);
    form.setFieldValue("perbaikanSpareparts", updatedList);
  }

  return (
    <fieldset className="border border-gray-200 rounded">
      <legend className="p-2 ml-3">
        <div className="flex gap-x-2 items-center">
          <div style={{ width: 200 }}>
            <GudangMekanikOption
              noLabel
              name="gudangmekanik"
              onChange={onGudangMekanikChange}
              value={selectedGudangMekanik}
            />
          </div>
          <button type="button" className="button button-primary button-small" onClick={addSparepart} style={{ width: 50 }}>
            <IconPlus />
          </button>
        </div>
      </legend>
      <div className="md:px-3 overflow-x-auto max-w-max md:max-w-full">
        {!form.values.perbaikanSpareparts?.length ? (
          <div className="p-3 flex justify-center items-center mb-3">
            <h4 className="text-lg">Belum ada sparepart</h4>
          </div>
        ) : (
          <div className="relative overflow-x-auto mb-3 overflow-y-auto flex-grow data-table-content rounded">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="th-table text-left">Sparepart</th>
                  <th className="th-table" style={{ width: 100 }}>Stok</th>
                  <th className="th-table" style={{ width: 100 }}>Kuantitas</th>
                  <th className="th-table" style={{ width: 50 }}>&times;</th>
                </tr>
              </thead>
              <tbody>
                {form.values.perbaikanSpareparts?.map((detail, index) => (
                  <tr className="tr-table" key={detail?.id}>
                    <td className="td-table">{detail?.sparepart}</td>
                    <td className="td-table text-center">{detail?.stok}</td>
                    <td className="td-table">
                      <input
                        type="number"
                        className="text-input text-center"
                        name={`jumlah_${detail?.id}`}
                        id={`jumlah_${detail?.id}`}
                        value={detail?.jumlah}
                        min={1}
                        max={detail?.stok > 0 ? detail?.stok : 1}
                        onChange={(event) => onJumlahChange(event, index)}
                      />
                    </td>
                    <td className="td-table">
                      <button
                        type="button"
                        className="button button-danger button-small"
                        onClick={() => removeSparepart(detail?.id)}
                      >
                        <IconTrash size={18} />
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

export const DetailKerusakan = ({ form }) => {
  const [selectedKerusakan, setselectedKerusakan] = React.useState(null);

  const addKerusakan = () => {
    // Cek jika kerusakan (sudah ada / belum)
    if (!form.values.perbaikanKerusakans.some(item => item?.kerusakan === selectedKerusakan?.value)) {
      const updatedList = [...form.values.perbaikanKerusakans, {
        id: randId(),
        kerusakan: selectedKerusakan?.value,
        label: selectedKerusakan?.label,
        jumlah: selectedKerusakan?.jumlah,
        durasi: selectedKerusakan?.durasi,
        durasi_in_seconds: selectedKerusakan?.durasi_in_seconds,
        poin: selectedKerusakan?.poin
      }]
      if (!selectedKerusakan) {
        Toast.fire({
          icon: "error",
          text: `Mohon pilih kerusakan!`
        })
      } else {
        form.setFieldValue("perbaikanKerusakans", updatedList);
        setselectedKerusakan(null);
      }
    } else {
      Toast.fire({
        icon: "error",
        text: `Kerusakan ${selectedKerusakan?.label} sudah ada!`
      });
    }
  }

  const onKerusakanChange = (data) => {
    setselectedKerusakan(data);
  }

  const onJumlahChange = (event, index) => {
    const { value } = event.target;
    const jumlah = form.setFieldValue(`perbaikanKerusakans[${index}]['jumlah']`, Number(value))
  }

  const removeKerusakan = (id) => {
    const updatedList = form.values.perbaikanKerusakans.filter(item => item?.id !== id);
    form.setFieldValue("perbaikanKerusakans", updatedList);
  }

  const formatDurasi = (durasi, jumlah) => {
    let durationValue = durasi?.split(" ");
    return `${Number(durationValue[0])*Number(jumlah)} ${durationTemplate.find(item => item?.value === durationValue[1])?.label}`;
  }

  return (
    <fieldset className="border border-gray-200 rounded mb-3">
      <legend className="p-2 ml-3">
        <div className="flex gap-x-2 items-center">
          <div style={{ width: 200 }}>
            <KerusakanOption
              noLabel
              name="kerusakan"
              onChange={onKerusakanChange}
              value={selectedKerusakan}
            />
          </div>
          <button
            type="button"
            className="button button-primary button-small"
            style={{ width: 50 }}
            onClick={addKerusakan}
          >
            <IconPlus />
          </button>
        </div>
      </legend>
      <div className="md:px-3 overflow-x-auto max-w-max md:max-w-full">
        {!form.values.perbaikanKerusakans?.length ? (
          <div className="p-3 flex justify-center items-center mb-3">
            <h4 className="text-lg">Belum ada kerusakan</h4>
          </div>
        ) : (
          <div className="relative overflow-x-auto mb-3 overflow-y-auto flex-grow data-table-content rounded">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="th-table text-left">Kerusakan</th>
                  <th className="th-table" style={{ width: 100 }}>Jumlah</th>
                  <th className="th-table" style={{ width: 100 }}>Durasi</th>
                  <th className="th-table" style={{ width: 50 }}>&times;</th>
                </tr>
              </thead>
              <tbody>
                {form.values.perbaikanKerusakans?.map((detail, index) => (
                  <tr className="tr-table" key={detail?.id}>
                    <td className="td-table">{detail?.label}</td>
                    <td className="td-table">
                      <input
                        type="number"
                        className="text-input text-center"
                        name={`jumlah_kerusakan_${detail?.id}`}
                        id={`jumlah_kerusakan_${detail?.id}`}
                        value={detail?.jumlah}
                        min={1}
                        onChange={(event) => onJumlahChange(event, index)}
                      />
                    </td>
                    <td className="td-table text-center">{formatDurasi(detail?.durasi, detail?.jumlah)}</td>
                    <td className="td-table">
                      <button
                        type="button"
                        className="button button-danger button-small"
                        onClick={() => removeKerusakan(detail?.id)}
                      >
                        <IconTrash size={18} />
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

export default Add