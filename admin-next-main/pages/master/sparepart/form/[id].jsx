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

// Setup validasi form
const validationSchema = Yup.object().shape({
    namaBarang: Yup.string().required("Wajib diisi!"),
    merk: Yup.string().required("Wajib diisi!"),
    spesifikasi: Yup.string().required("Wajib diisi!"),
    kategori: Yup.string().required("Wajib diisi!"),
});

const Edit = () => {
    const { id } = useRouter()?.query;
    const context = "Mekanik";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            namaBarang: "",
            merk: "",
            spesifikasi: "",
            kategori: "",
            stok: 0
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
                        <TextInput form={form} label="Nama Barang" name="namaBarang" />
                        <TextInput form={form} label="Merk" name="merk" />
                        <TextInput form={form} label="Spesifikasi" name="spesifikasi" />
                        <TextInput form={form} label="Kategori" name="kategori" />
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