import React from 'react'
import Layout from '../../../components/layouts/Layout'
import { useFormik } from 'formik';
import * as Yup from "yup";
import TextInput from '../../../components/widgets/TextInput';
import BackButton from '../../../components/widgets/BackButton';
import SubmitButton from '../../../components/widgets/SubmitButton';
import { get, put } from '../../../utils/api';
import { apiUrl } from '..';
import { Toast } from '../../../utils/swal';
import { useRouter } from 'next/router';
import SelectInput from '../../../components/widgets/SelectInput';
import MachineOption from '../../../components/widgets/MachineOption';
import MechanicOption from '../../../components/widgets/MechanicOption';
import TextareaInput from '../../../components/widgets/TextareaInput';
import moment from 'moment';
import { getTimeDiff, getTimeDuration } from '../../../utils/helper';
import ReadOnlyInput from '../../../components/widgets/ReadOnlyInput';
import { DetailKerusakan, DetailSparepart, getKerusakanDuration, jenisPerbaikan } from '.';

// Setup validasi form
const validationSchema = Yup.object().shape({
    mesin: Yup.number().required("Wajib diisi!"),
    startDate: Yup.string().required("Wajib diisi!"),
    jenisPerbaikan: Yup.string().required("Mohon pilih jenis perbaikan").oneOf(["repairment", "maintenance"])
});

const Edit = () => {
    const { id } = useRouter()?.query;
    const context = "Perbaikan";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [fetchingData, setFetchingData] = React.useState(true);

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

            put(`${apiUrl}/${id}`, {
                ...values,
                endDate: values?.endDate === "" ? null : values?.endDate,
                perbaikanSpareparts: values.perbaikanSpareparts.map(item => ({
                    gudangmekanik: item?.gudangmekanik,
                    jumlah: item?.jumlah
                })),
                perbaikanKerusakans: values.perbaikanKerusakans.map(item => ({
                    kerusakan: item?.kerusakan
                }))
            })
                .then(result => {
                    if (result?.data?.id) {
                        Toast.fire({
                            icon: "success",
                            text: result?.message
                        }).then(() => {
                            router.push("/perbaikan");
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
                });
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

    const getRow = () => {
        setFetchingData(true);
        get(`${apiUrl}/${id}`)
            .then(result => {
                if (result?.id) {
                    form.setValues({
                        mesin: result?.mesin,
                        user: result?.user,
                        note: result?.note,
                        startDate: moment(result?.startDate).format("YYYY-MM-DD HH:mm"),
                        endDate: result?.endDate ? moment(result?.endDate).format("YYYY-MM-DD HH:mm") : "",
                        uploadPhotos: result?.uploadPhotos,
                        noLaporan: result?.noLaporan,
                        jenisPerbaikan: result?.jenisPerbaikan,
                        perbaikanMekaniks: result?.mekaniks?.map(item => ({
                            mekanik: item?.id
                        })),
                        perbaikanSpareparts: result?.spareparts?.map(item => ({
                            id: item?.id,
                            gudangmekanik: item?.id,
                            sparepart: item?.sparepart,
                            stok: item?.stok,
                            jumlah: result?.perbaikanSpareparts?.find(perbaikanSparepart => perbaikanSparepart?.gudangmekanik === item?.id)?.jumlah
                        })),
                        perbaikanKerusakans: result?.kerusakans?.map(item => ({
                            id: item?.id,
                            kerusakan: item?.id,
                            label: item?.kerusakan,
                            durasi: item?.durasi,
                            durasi_in_seconds: item?.durasi_in_seconds,
                            poin: item?.poin
                        }))
                    });
                }
            })
            .catch(error => {
                Toast.fire({
                    icon: "error",
                    text: "Data tidak ditemukan!"
                });
            })
            .finally(() => {
                setTimeout(() => {
                    setFetchingData(false);
                }, 1000);
            });
    }

    React.useEffect(() => {
        getRow();
        // eslint-disable-next-line
    }, [id]);

    return (
        <Layout title={`Edit ${context}`}>
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
                                    edit
                                />
                            </div>
                            <div className="flex-grow"></div>
                            <div className="flex-shrink-0 w-full md:w-1/3">
                                <TextareaInput form={form} label="Note" name="note" placeholder="Catatan singkat." />
                            </div>
                        </div>
                    </div>

                    {!fetchingData ? (
                        <>
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
                                        <ReadOnlyInput label="Downtime" value={getTimeDiff(form.values.startDate, form.values.endDate)} />
                                        <ReadOnlyInput label="Estimasi" value={getTimeDuration(getKerusakanDuration(form.values.perbaikanKerusakans))} />
                                    </div>
                                </div>
                                <DetailKerusakan form={form} />
                            </div>
                            {/* End Detail Kerusakan */}
                        </>
                    ) : (
                        <div className="flex justify-center items-center my-8">
                            <h5 className="text-center text-xl">Mengambil Data...</h5>
                        </div>
                    )}

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

export default Edit