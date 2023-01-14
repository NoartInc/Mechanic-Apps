import React from 'react'
import Layout from '../../../../components/layouts/Layout'
import { useFormik } from 'formik';
import * as Yup from "yup";
import TextInput from '../../../../components/widgets/TextInput';
import BackButton from '../../../../components/widgets/BackButton';
import SubmitButton from '../../../../components/widgets/SubmitButton';
import { post } from '../../../../utils/api';
import { apiUrl } from '..';
import { Toast } from '../../../../utils/swal';
import { useRouter } from 'next/router';

// Setup validasi form
const validationSchema = Yup.object().shape({
    kerusakan: Yup.string().required("Wajib diisi!"),
    poin: Yup.string().required("Wajib diisi!"),
    durasi: Yup.string().required("Wajib diisi!")
});

const Add = () => {
    const context = "Kerusakan";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            kerusakan: "",
            poin: 0,
            durasi: ""
        },
        onSubmit: (values) => {
            setLoading(true);
            post(apiUrl, values)
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
                    <div className="w-full md:w-1/2">
                        <TextInput form={form} label="Kerusakan" name="kerusakan" />
                        <TextInput form={form} label="Poin" name="poin" type="number" />
                        <TextInput form={form} label="Durasi" name="durasi" />
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

export default Add