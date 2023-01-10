import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import SubmitButton from "../components/widgets/SubmitButton";
import TextInput from "../components/widgets/TextInput";
import { post } from "../utils/api";
import { Toast } from "../utils/swal";

const title = "Login";
const pageUrl = "/login";
const apiUrl = "/login";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Wajib diisi!"),
  password: Yup.string().required("Wajib diisi!"),
});

function login() {
  const context = "Login";
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const form = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      post(apiUrl, values)
        .then((result) => {
          if (result?.data?.id) {
            Toast.fire({
              icon: "success",
              text: result?.message,
            }).then(() => {
              router.back();
            });
          }
        })
        .catch((error) => {
          Toast.fire({
            icon: "error",
            text: "Gagal menyimpan data",
            timer: 5000,
          });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    },
  });

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="px-12 h-full text-gray-800">
        <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-4/8 lg:w-4/8 md:w-4/8 mb-12 md:mb-0">
          <Image
            src="/images/logo_login.jpg"
            width={240}
            height={80}
            style={{ height: "auto", width: "auto" }}
            alt="Sample image"
          />
        </div>
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
          <h1 className="mb-6 text-3xl font-semibold text-center text-slate-700">
            Welcome to Mechanic App
          </h1>
          <form onSubmit={form.handleSubmit}>
            <div>
              <TextInput
                form={form}
                label=""
                name="mekanik"
                placeholder="Username"
              />
              <TextInput
                form={form}
                label=""
                name="kontak"
                placeholder="Password"
              />
            </div>
            <div className="card-page-footer">
              <SubmitButton loading={loading} />
            </div>
            <p className="text-sm font-medium mt-2 pt-1 mb-0">
              Bermasalah dengan login?
              <a
                href="https://wa.me/6282273017654"
                className="ml-1 text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
              >
                Hubungi Administrator
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default login;
