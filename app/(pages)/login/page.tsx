
"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import Logo from '../../_images/apco.png';
// import Photo from '@app/_images/apco.png';
// import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import ls from 'localstorage-slim';


const Login = () => {
    const { handleSubmit, register, reset, formState: { errors }, setValue } = useForm({});
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            setDisabled(true);
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, data);
            if (res.status === 200) {
                ls.set("u", res.data.data.userRole, { encrypt: true });
                ls.set("e", res.data.data.email, { encrypt: true });
                ls.set("i", res.data.data._id, { encrypt: true });
                if(res.data.data.userRole === 'user'){
                    router.push('/userDashboard')
                }else{
                    router.push('/admin')
                }  
            }
        } catch (error: any) {
            setDisabled(false);
            // console.error("ERROR", error);
            // toast(error?.response?.data?.message || "An error occurred", { type: "error" });
        }
    };
    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const signupPage=()=>{
        router.push('/signup')
    }

    return (
        <main className='h-screen w-screen relative flex bg-[#ffffff] p-8'>
            <div className='bg-transparent basis-1/2 flex flex-row justify-center items-center'>
                <div className='w-full sm:w-[60%] '>
                    <div className='flex flex-col gap-y-5 border-b-[2px] pb-8 mb-8 border-gray-200'>
                        <Image src={Logo} alt="Logo" height={90} width={90} className='' />
                        <div className='flex flex-col'>
                            <h1 className='font-semibold text-xl'>Get Started</h1>
                            <h4 className='text-gray-400 text-sm'>Welcome to Apco Medicare</h4>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-6'>
                        <div className='flex flex-col gap-y-1 w-full'>
                            <p className='text-xs font-semibold px-1'>Email</p>
                            <input type="text" {...register('email')} placeholder='abc@gmail.com' className="border-gray-400 text-sm border-[1px] rounded-md pl-4 pr-4 py-2 focus-visible:outline-[#014db7!important]" />
                        </div>
                        <div className='flex flex-col gap-y-1 w-full'>
                            <div className='text-xs font-semibold px-1 flex justify-between'>
                                <p>Password</p>
                                <p className='cursor-pointer'>Forgot?</p>
                            </div>
                            <input type="password" {...register('password')} className="border-gray-400 text-sm border-[1px] rounded-md pl-4 pr-4 py-2 focus-visible:outline-[#014db7!important]" />
                        </div>
                        <button type='submit' disabled={disabled} className={`flex text-white font-semibold text-center justify-center gap-y-1 w-full ${disabled ? "bg-gradient-to-tl from-[#a9a9a9] to-[black]" : "bg-gradient-to-tl from-[#014db7] to-[black]"} py-2 rounded-md`}>
                            {disabled ? 'Submitting' : "Sign in"}
                        </button>
                    </form>
                    <div className='mt-5 justify-center flex'>
                    <span>Don&apos;t have an account yet?
                        <button onClick={signupPage} className='text-blue-700'>SignUp</button>
                    </span>
                </div>
                </div>
               
            </div>
            <div className='basis-1/2'>
                <Image src={Logo} className='w-full h-full rounded-lg' alt="logo" />
            </div>
        </main>
    )
}

export default Login;
