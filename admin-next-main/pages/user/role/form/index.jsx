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
import Checkbox from '../../../../components/widgets/Checkbox';

// Setup validasi form
const validationSchema = Yup.object().shape({
    roleName: Yup.string().required("Wajib diisi!")
});

const Add = () => {
    const context = "Role";
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [roleAccess, setRoleAccess]  = React.useState([]);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            roleName: "",
            roleAccess: []
        },
        onSubmit: (values) => {
            console.log("di submit");
            setLoading(true);
            post(apiUrl, {
                ...values,
                roleAccess: roleAccess
            })
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

    const roleAccessInit = () => {
        menu.forEach(item => {
            if (item?.path === "#") {
                if (item?.children) {
                    item?.children?.forEach(child => {
                        setRoleAccess(prevState => ([...prevState, {
                            path: child?.path,
                            view: false,
                            create: false,
                            update: false,
                            delete: false,
                            export: false
                        }]))
                    });
                }
            } else {
                setRoleAccess(prevState => ([...prevState, {
                    path: item?.path,
                    view: false,
                    create: false,
                    update: false,
                    delete: false,
                    export: false
                }]))
            }
        })
    }

    const setAccess = (path, option) => {
        const updatedAccess = roleAccess.map(item => {
            if (item?.path === path) {
                return {
                    ...item,
                    ...option
                }
            }
            return item;
        });
        setRoleAccess(updatedAccess);
    }

    React.useEffect(() => {
        roleAccessInit();
    }, []);

    return (
        <Layout title={`Tambah ${context}`}>
            <div className="card-page">
                <form onSubmit={form.handleSubmit}>
                    <div>
                        <TextInput form={form} label="Role Name" name="roleName" />
                        <hr className="my-3" />
                        <table className="table-auto w-full">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="text-left p-2">Menu</th>
                                    <th className="text-left p-2">View</th>
                                    <th className="text-left p-2">Create</th>
                                    <th className="text-left p-2">Update</th>
                                    <th className="text-left p-2">Delete</th>
                                    <th className="text-left p-2">Export</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menu.map((item, index) => {
                                    const Icon = item?.icon;

                                    if (item?.path === "#") {
                                        return (
                                            <React.Fragment key={index}>
                                                <tr className="bg-slate-100">
                                                    <td colSpan="100%" className="p-2">
                                                        <div className="flex gap-x-1 items-center">
                                                            <Icon size={18} />
                                                            <span className="ml-1">{item?.title}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {item?.children?.map((child, childIndex) => (
                                                     <tr key={childIndex}>
                                                        <td className="p-2">
                                                            <span className="ml-6">{child?.title}</span>
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="View" 
                                                                id={`view-${index}-${childIndex}`}
                                                                 name="view[]" 
                                                                onChange={setAccess} 
                                                                access="view"
                                                                data={child}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Create" 
                                                                id={`create-${index}-${childIndex}`} 
                                                                name="create[]" 
                                                                onChange={setAccess} 
                                                                access="create"
                                                                data={child}
                                                                />
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Update" 
                                                                id={`update-${index}-${childIndex}`} 
                                                                name="update[]" 
                                                                onChange={setAccess} 
                                                                access="update"
                                                                data={child}
                                                                />
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Delete" 
                                                                id={`delete-${index}-${childIndex}`} 
                                                                name="delete[]" 
                                                                onChange={setAccess} 
                                                                access="delete"
                                                                data={child}
                                                                />
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Export" 
                                                                id={`export-${index}-${childIndex}`} 
                                                                name="export[]" 
                                                                onChange={setAccess}
                                                                access="export"
                                                                data={child}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        )
                                    } else {
                                        return (
                                            <tr key={index}>
                                                <td className="p-2">
                                                    <div className="flex items-center gap-x-1">
                                                        <Icon size={18} />
                                                        <span className="ml-1">{item?.title}</span>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <Checkbox 
                                                        label="View" 
                                                        id={`view-${index}`} 
                                                        name="view[]" 
                                                        onChange={setAccess} 
                                                        access="view"
                                                        data={item}
                                                    />
                                                </td>
                                                {item?.path !== "/" && (
                                                    <>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Create" 
                                                                id={`create-${index}`} 
                                                                name="create[]" 
                                                                onChange={setAccess} 
                                                                access="create"
                                                                data={item}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Update" 
                                                                id={`update-${index}`} 
                                                                name="update[]" 
                                                                onChange={setAccess} 
                                                                access="update"
                                                                data={item}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Delete" 
                                                                id={`delete-${index}`} 
                                                                name="delete[]" 
                                                                onChange={setAccess} 
                                                                access="delete"
                                                                data={item}
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <Checkbox 
                                                                label="Export" 
                                                                id={`export-${index}`} 
                                                                name="export[]" 
                                                                onChange={setAccess} 
                                                                access="export"
                                                                data={item}
                                                            />
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )
                                    }
                                    
                                })}
                            </tbody>
                        </table>
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