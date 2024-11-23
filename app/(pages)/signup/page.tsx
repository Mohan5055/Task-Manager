
'use client';

import React, { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type CreateUserProps = {
    isModalOpen: boolean;
    toggleModal: () => void;
};

const CreateUser: React.FC<CreateUserProps> = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [disabled, setDisabled] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter();
    const [close, setClose] = useState(true);

    // Submit handler for the form
    const onSubmit = async (data: any) => {
        try {
            setDisabled(true);

            // API request to create a user
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/signup`, data);
            console.log("res.data", res.data);
            if (res.status === 201) {
                toast("User Created Successfully", { type: "success" });
                reset(); // Reset form fields after successful submission
                router.push('/login'); // Redirect to login page
            } else {
                throw new Error(res.data.message || "Failed to create user");
            }
        } catch (error: any) {
            console.error("ERROR", error);
            toast(error?.response?.data?.message || error.message, { type: "error" });
        } finally {
            setDisabled(false);
        }
    };

    // Handle modal close and redirect to login page
    const onClose = () => {
        setClose(false); // Close the modal
        router.push('/login'); // Redirect to the login page
    };

    if (!close) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Add New User</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center"
                    >
                        <RiCloseLine className="text-2xl" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#171717] mb-1">
                            Name
                        </label>
                        <div className="w-full p-2 border-2 rounded-md flex items-center border-[#d7d7dd]">
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                className="w-full p-1 outline-none"
                            />
                        </div>
                        {typeof errors?.name?.message === 'string' && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#171717] mb-1">
                            Email
                        </label>
                        <div className="w-full p-2 border-2 rounded-md flex items-center border-[#d7d7dd]">
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="w-full p-1 outline-none"
                            />
                        </div>
                        {typeof errors?.email?.message === 'string' && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#101010] mb-1">
                            Password
                        </label>
                        <div className="w-full p-2 border-2 rounded-md flex items-center border-[#d7d7dd]">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required' })}
                                className="w-full p-1 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="ml-2"
                            >
                                {showPassword ? (
                                    <AiOutlineEye className="text-xl text-[#101010]" />
                                ) : (
                                    <AiOutlineEyeInvisible className="text-xl text-[#101010]" />
                                )}
                            </button>
                        </div>
                        {typeof errors?.password?.message === 'string' && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex justify-center mt-10">
                        <button
                            type="submit"
                            disabled={disabled}
                            className="bg-[#6422f2] border-2 border-[#9260ff] text-white px-8 py-1 rounded-xl"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
