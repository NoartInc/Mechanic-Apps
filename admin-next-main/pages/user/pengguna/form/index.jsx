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
import SelectInput from '../../../../components/widgets/SelectInput';
import RoleOption from '../../../../components/widgets/RoleOption';

// Setup validasi form
const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Wajib diisi!"),
    userName: Yup.string().required("Wajib diisi!"),
    password: Yup.string().required("Wajib diisi!"),
    role: Yup.string().required("Wajib diisi!"),
    jabatan: Yup.string().required("Wajib diisi!"),
    email: Yup.string().required("Wajib diisi!"),
    contact: Yup.string().required("Wajib diisi!"),
    status: Yup.string().required("Wajib diisi!")
});

export const status = [
    {
        value: "active",
        label: "Active"
    },
    {
        value: "inactive",
        label: "Inactive"
    }
]

const Add = () => {
    const context = "Pengguna";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            fullName: "",
            userName: "",
            password: "",
            role: "",
            jabatan: "",
            email: "",
            contact: "",
            status: "active",
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
                    <div>
                        <div className="flex flex-col md:flex-row justify-start md:justify-between">
                            <div className="w-full md:w-2/5">
                                <TextInput form={form} label="Fullname" name="fullName" />
                                <TextInput form={form} label="Username" name="userName" />
                                <TextInput form={form} label="Password" name="password" />
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

export default Add