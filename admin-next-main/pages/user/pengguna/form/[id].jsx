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
import RoleOption from '../../../../components/widgets/RoleOption';

// Setup validasi form
const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Wajib diisi!"),
    userName: Yup.string().required("Wajib diisi!"),
    // password: Yup.string().required("Wajib diisi!"),
    role: Yup.string().required("Wajib diisi!"),
    jabatan: Yup.string().required("Wajib diisi!"),
    email: Yup.string().required("Wajib diisi!"),
    contact: Yup.string().required("Wajib diisi!"),
    status: Yup.string().required("Wajib diisi!")
});

const Edit = () => {
    const { id } = useRouter()?.query;
    const context = "Pengguna";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            fullName: "",
            userName: "",
            password: "",
            role: 0,
            jabatan: "",
            email: "",
            contact: "",
            status: "active",
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
    }, [id]);

    return (
        <Layout title={`Edit ${context}`}>
            <div className="card-page">
                <form onSubmit={form.handleSubmit}>
                    <div>
                        <div className="flex flex-col md:flex-row justify-start md:justify-between">
                            <div className="w-full md:w-2/5">
                                <TextInput form={form} label="Fullname" name="fullName" />
                                <TextInput form={form} label="Username" name="userName" />
                                {/* <TextInput form={form} label="Password" name="password" /> */}
                                <RoleOption
                                    label="Role"
                                    name="role"
                                    value={form.values.role}
                                    onChange={(value) => form.setFieldValue("role", value)}
                                />
                            </div>
                            <div className="w-full md:w-2/5">
                                <TextInput form={form} label="Jabatan" name="jabatan" />
                                <TextInput form={form} label="Email" name="email" />
                                <TextInput form={form} label="Contact" name="contact" />
                                <SelectInput form={form} label="Status" name="status" options={status} />
                            </div>
                        </div>
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