import { IconArrowLeft } from '@tabler/icons';
import { useRouter } from 'next/router'
import React from 'react'
import forbiddenImage from "../../data/images/forbidden.svg";
import Image from 'next/image';

const ForbiddenAccess = ({ text = "Anda tidak memiliki akses untuk melihat halaman ini!" }) => {
    const router = useRouter();
    return (
        <div className="bg-gray-200">
            <div className="flex justify-center items-center flex-col min-h-screen p-3 md:p-5">
                <div className="w-full md:w-1/4">
                    <div className="mb-5">
                        <Image src={forbiddenImage} alt="" priority />
                    </div>
                    <h3 className="text-xl text-center font-normal mb-3">
                        {text}
                    </h3>
                    <div className="w-1/2 mx-auto">
                        <button className="button button-primary flex" type="button" onClick={() => router.push("/")}>
                            <IconArrowLeft size={18} />
                            <span>Home</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForbiddenAccess