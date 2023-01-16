import React from 'react'
import Modal from './Modal'
import FileUpload from './FileUpload'
import SubmitButton from './SubmitButton';
import { useFormik } from 'formik';
import { Toast } from '../../utils/swal';
import { fileUpload } from '../../utils/api';


const ModalUpload = React.forwardRef((props, _ref) => {
    const [showUpload, setShowUpload] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const form = useFormik({
        initialValues: {
            [props?.name]: null
        },
        onSubmit: (values) => {
            setLoading(true);
            fileUpload(`${props?.uploadUrl}`, values, {
                method: props?.method,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(result => {
                if (result?.status) {
                    Toast.fire({
                        icon: "success",
                        text: "File berhasil diunggah",
                        timer: 1000
                    }).then(() => {
                        props.onSuccess();
                        setTimeout(() => {
                            setShowUpload(false);
                        }, 500);
                    })
                }
            }).catch(error => {
                Toast.fire({
                    icon: "error",
                    text: error?.error ?? "File gagal diunggah!"
                })
            }).finally(() => {
                setLoading(false);
            })
        }
    })

    const uploadFile = (event) => {
        event.preventDefault();
        if (!form.values[props?.name]) {
            Toast.fire({
                icon: "error",
                text: "Mohon pilih file / drag & drop file!"
            });
            return false;
        } else {
            form.handleSubmit();
        }
    }

    const closeUpload = () => {
        setShowUpload(false);
    }

    React.useImperativeHandle(_ref, () => ({
        openUpload: () => setShowUpload(true)
    }))

    return (
        <form onSubmit={uploadFile}>
            <Modal
                show={showUpload}
                onClose={closeUpload}
                action={<SubmitButton loading={loading} text="Upload" />}
            >
                <FileUpload
                    accept={props?.fileType}
                    onChange={(file) => form.setFieldValue(props?.name, file)}
                />
            </Modal>
        </form>
    )
})

ModalUpload.displayName = "ModalUpload";

export default ModalUpload