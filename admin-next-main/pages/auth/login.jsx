import Head from 'next/head'
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import InputForm from '../../components/widgets/InputForm';
import CheckboxInput from '../../components/widgets/CheckboxInput';
import SubmitButton from '../../components/widgets/SubmitButton';
import loginImage from "../../data/images/login.svg";
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { login, rememberLogin } from '../../store/modules/auth';
import { useRouter } from 'next/router';
import { Toast } from '../../utils/swal';
import axios from 'axios';
import { baseUrl } from '../../utils/api';

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Wajib diisi!"),
    password: Yup.string().required("Wajib diisi!")
})

const Login = () => {
    let mounted = React.useRef(false);
    const { user, token, remember: savedLogin } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [rememberMe, setRememberMe] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const form = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            username: "",
            password: ""
        },
        onSubmit: (values) => {
            setLoading(true);
            axios.post(`${baseUrl}/auth`, values, {
                timeout: 10000
            })
                .then(result => {
                    if (result?.data?.status) {
                        dispatch(login(result?.data?.data));
                        router.push("/");
                    }
                })
                .catch(error => {
                    Toast.fire({
                        icon: "error",
                        text: error?.response?.data?.error ?? "Gagal melakukan login!"
                    });
                })
                .finally(() => {
                    setTimeout(() => {
                        if (mounted.current) {
                            setLoading(false);
                        }
                    }, 500);
                })
        }
    });

    React.useEffect(() => {
        mounted.current = true;

        if (savedLogin) {
            form.setValues(savedLogin);
            setRememberMe(true);
        } else {
            form.setValues({
                username: "",
                password: ""
            });
            setRememberMe(false);
        }

        return () => {
            mounted.current = false;
        }
    }, []);

    React.useEffect(() => {
        if (rememberMe) {
            dispatch(rememberLogin({
                username: form.values.username,
                password: form.values.password
            }));
        } else {
            dispatch(rememberLogin(null));
        }
    }, [rememberMe]);

    if (user && token) {
        router.push("/");
        return null;
    }

    return (
        <div className="bg-gray-200">
            <Head>
                <title>Login</title>
            </Head>
            <div className="login-wrapper">
                <div className="card-login">
                    <div className="md:w-1/2 bg-gray-800 p-8 px-16">
                        <div className="relative flex flex-col gap-y-8 justify-center items-center min-h-full">
                            <Image src="/images/logomechanic.png" alt="" width={180} height={45} style={{ width: "auto", height: "auto" }} priority />
                            <Image src={loginImage} alt="" priority />
                        </div>
                    </div>
                    <div className="md:w-1/2 p-8 px-16">
                        <h5 className="text-xl font-medium text-center my-3 mb-2">
                            Welcome to Mechanic App
                        </h5>
                        <p className="text-gray-500 font-light text-center mb-6 text-sm">
                            Untuk membuka panel,<br /> mohon lakukan login terlebih dahulu
                        </p>
                        <div className="mb-8">
                            <form onSubmit={form.handleSubmit}>
                                <InputForm
                                    label="Username"
                                    name="username"
                                    value={form?.values?.username}
                                    onChange={form.handleChange}
                                    placeholder="Username Akun"
                                    className="mb-3"
                                    errors={form.errors}
                                    touched={form.touched}
                                />
                                <InputForm
                                    label="Password"
                                    name="password"
                                    value={form?.values?.password}
                                    onChange={form.handleChange}
                                    type="password"
                                    placeholder="Password Akun"
                                    className="mb-4"
                                    errors={form.errors}
                                    touched={form.touched}
                                />
                                <div className="flex items-center gap-x-2 mb-5">
                                    <CheckboxInput
                                        noLabel
                                        onChange={(event) => setRememberMe(event.target.checked)}
                                        id="remember-me"
                                        name="remember_me"
                                        value={rememberMe}
                                    />
                                    <label htmlFor="remember-me" className="cursor-pointer">Remember Me</label>
                                </div>
                                <SubmitButton loading={loading} text="Login" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login