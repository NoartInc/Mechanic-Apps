import React from 'react'
import Layout from '../../../../components/layouts/Layout'
import { useRouter } from 'next/router';
import * as Yup from "yup";
import { apiUrl } from '..';
import BackButton from '../../../../components/widgets/BackButton';
import SubmitButton from '../../../../components/widgets/SubmitButton';
import TextInput from '../../../../components/widgets/TextInput';
import { useFormik } from 'formik';
import { get, put } from '../../../../utils/api';
import { Toast } from '../../../../utils/swal';
import { status } from '.';
import SelectInput from '../../../../components/widgets/SelectInput';

// Setup validasi form
const validationSchema = Yup.object().shape({
    mesin: Yup.string().required("Wajib diisi!"),
    kategori: Yup.string().required("Wajib diisi!"),
    lokasi: Yup.string().required("Wajib diisi!"),
    merk: Yup.string().required("Wajib diisi!"),
    status: Yup.string().required("Wajib diisi!"),
});

const Edit = () => {
    const { id } = useRouter()?.query;
    const context = "Mesin";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            mesin: "",
            kategori: "",
            lokasi: "",
            merk: "",
            status: "active"
        },
        onSubmit: (values) => {
            setLoading(true);
            put(`${apiUrl}/${id}`, values)
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

    const getRow = () => {
        get(`${apiUrl}/${id}`)
            .then(result => {
                if (result?.id) {
                    form.setValues(result);
                }
            })
            .catch(error => {
                Toast.fire({
                    icon: "error",
                    text: "Data tidak ditemukan!"
                });
            });
    }

    React.useEffect(() => {
        getRow();
        // eslint-disable-next-line
    }, [id]);

    return (
        <Layout title={`Edit ${context}`}>
            <div className="card-page">
                <form onSubmit={form.handleSubmit}>
                    <div className="w-full md:w-1/2">
                        <TextInput form={form} label="Mesin" name="mesin" />
                        <TextInput form={form} label="Kategori" name="kategori" />
                        <TextInput form={form} label="Lokasi" name="lokasi" />
                        <TextInput form={form} label="Merk" name="merk" />
                        <SelectInput form={form} label="Status" name="status" options={status} />
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

export default Edit