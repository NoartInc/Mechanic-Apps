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
import DurationInput from '../../../../components/widgets/DurationInput';

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
            durasi: "",
            durasi_in_seconds: 0
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

    const onDurationChange = (text, seconds) => {
        form.setFieldValue("durasi", text);
        form.setFieldValue("durasi_in_seconds", seconds);
    }

    return (
        <Layout title={`Tambah ${context}`}>
            <div className="card-page">
                <form onSubmit={form.handleSubmit}>
                    <div className="w-full md:w-1/2">
                        <TextInput form={form} label="Kerusakan" name="kerusakan" />
                        <TextInput form={form} label="Poin" name="poin" type="number" />
                        {/* <TextInput form={form} label="Durasi" name="durasi" /> */}
                        <DurationInput
                            label="Durasi"
                            name="durasi"
                            value={form.values.durasi}
                            onChange={onDurationChange}
                            errors={form.errors}
                            touched={form.touched}
                        />
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