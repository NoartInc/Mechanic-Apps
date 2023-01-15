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
import menu from "../../../../data/menu";
import CheckboxInput from '../../../../components/widgets/CheckboxInput';

// Setup validasi form
const validationSchema = Yup.object().shape({
    roleName: Yup.string().required("Wajib diisi!")
});

const Add = () => {
    const context = "Role";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [toggleAccessCheck, setToggleAccessCheck] = React.useState(false);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            roleName: "",
            roleAccess: []
        },
        onSubmit: (values) => {
            console.log("di submit");
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

    const toggleAccess = (event) => {
        const { checked } = event.target;
        const updatedRole = form.values.roleAccess?.map(item => {
            return {
                ...item,
                view: checked,
                create: checked,
                update: checked,
                delete: checked,
                export: checked
            }
        });
        form.setFieldValue("roleAccess", updatedRole);
        setToggleAccessCheck(checked);
    }

    const toggleModuleAccess = (index) => {
        form.setFieldValue(`roleAccess[${index}]["view"]`, !form.values.roleAccess[index]["view"]);
        form.setFieldValue(`roleAccess[${index}]["create"]`, !form.values.roleAccess[index]["create"]);
        form.setFieldValue(`roleAccess[${index}]["update"]`, !form.values.roleAccess[index]["update"]);
        form.setFieldValue(`roleAccess[${index}]["delete"]`, !form.values.roleAccess[index]["delete"]);
        form.setFieldValue(`roleAccess[${index}]["export"]`, !form.values.roleAccess[index]["export"]);
    }

    const checkAccess = (event, index) => {
        const { name, checked } = event.target;
        form.setFieldValue(`roleAccess[${index}][${name}]`, checked);
    }

    const roleAccessInit = () => {
        let roleAccessMenu = menu.filter(item => item?.path !== "#" && !item?.children)?.map(item => ({
            title: item?.title,
            identifier: item?.title?.replace(" ", "_")?.toLowerCase(),
            path: item?.path,
            permissions: item?.permissions ?? null,
            view: false,
            create: false,
            update: false,
            delete: false,
            export: false
        }));
        menu.filter(item => item?.path === "#" && item?.children)?.forEach(item => {
            item?.children?.forEach(child => {
                roleAccessMenu.push({
                    title: child?.title,
                    identifier: child?.title?.replace(" ", "_")?.toLowerCase(),
                    path: child?.path,
                    permissions: child?.permissions ?? null,
                    view: false,
                    create: false,
                    update: false,
                    delete: false,
                    export: false
                });
            })
        })
        form.setFieldValue("roleAccess", roleAccessMenu);
    }

    React.useEffect(() => {
        roleAccessInit();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout title={`Tambah ${context}`}>
            <div className="card-page">
                <form onSubmit={form.handleSubmit}>
                    <div>
                        <div className="w-full md:w-2/5">
                            <TextInput form={form} label="Role Name" name="roleName" />
                            <CheckboxInput
                                label="All Permissions"
                                name="toggle_access"
                                id="toggle-access"
                                value={toggleAccessCheck}
                                onChange={toggleAccess}
                            />
                        </div>
                        <hr className="my-3" />
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="text-left p-2">Menu</th>
                                        <th className="p-2">View</th>
                                        <th className="p-2">Create</th>
                                        <th className="p-2">Update</th>
                                        <th className="p-2">Delete</th>
                                        <th className="p-2">Export</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.values.roleAccess?.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td
                                                className="min-w-max p-2 items-center align-middle cursor-pointer"
                                                onClick={() => toggleModuleAccess(index)}
                                            >
                                                {item?.title}
                                            </td>
                                            {!item?.permissions ? (
                                                <>
                                                    <td className="p-2" style={{ width: 80 }}>
                                                        <div className="flex justify-center">
                                                            <CheckboxInput
                                                                layout="column"
                                                                noLabel
                                                                name="view"
                                                                id={`${item?.identifier}_view`}
                                                                value={item?.view}
                                                                onChange={(event) => checkAccess(event, index)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="p-2"></td>
                                                    <td className="p-2"></td>
                                                    <td className="p-2"></td>
                                                    <td className="p-2"></td>
                                                </>
                                            ) : (
                                                item?.permissions?.map((permission, permissionIndex) => (
                                                    <td className="p-2" style={{ width: 80 }} key={permissionIndex}>
                                                        <div className="flex justify-center">
                                                            <CheckboxInput

                                                                layout="column"
                                                                noLabel
                                                                name={permission}
                                                                id={`${item?.identifier}_${permission}`}
                                                                value={item[permission]}
                                                                onChange={(event) => checkAccess(event, index)}
                                                            />
                                                        </div>
                                                    </td>
                                                ))
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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