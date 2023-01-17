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
import DurationInput from '../../../../components/widgets/DurationInput';

// Setup validasi form
const validationSchema = Yup.object().shape({
    kerusakan: Yup.string().required("Wajib diisi!"),
    poin: Yup.string().required("Wajib diisi!"),
    durasi: Yup.string().required("Wajib diisi!")
});

const Edit = () => {
    const { id } = useRouter()?.query;
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

    const onDurationChange = (text, seconds) => {
        form.setFieldValue("durasi", text);
        form.setFieldValue("durasi_in_seconds", seconds);
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

export default Edit