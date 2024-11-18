import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import TaskForge from '../../../assets/Taskforge.png';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Pattern from '../../../assets/Pattern.jpg';
import fingerprint from '../../../assets/fingerprint.png';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing token.");
            navigate('/app/sign-in');
        }
    }, [token, navigate]);

    const toggleShowPassword = (type: 'new' | 'confirm') => {
        if (type === 'new') {
            setShowNewPassword(!showNewPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const validatePassword = (password: string) => {
        const length = password.length >= 8;
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        const number = /[0-9]/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordValidations({
            length,
            uppercase,
            lowercase,
            number,
            specialChar,
        });
    };

    const handlePasswordChange = (password: string) => {
        setNewPassword(password);
        validatePassword(password);
    };

    const handleContinue = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (!Object.values(passwordValidations).every(Boolean)) {
            toast.error('Password does not meet the requirements.');
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Password reset successfully!');
        navigate('/app/sign-in');
    };

    return (
        <div className='max-w-full min-h-screen'>
            <div className='flex flex-col md:flex-row h-screen'>
                <div className='w-full md:w-1/2 h-full p-6'>
                    <div className='flex justify-between items-center w-full'>
                        <img src={TaskForge} alt="TaskForge" className='w-28 md:w-32' />
                        <Link to='/app/sign-up' className='text-forge-darkGreen font-poppins underline text-sm md:text-base'>
                            Create an account
                        </Link>
                    </div>

                    <div className='flex flex-col mt-12 md:mt-[70px] md:px-12 gap-4 md:gap-5'>
                        <div className='flex items-center gap-3'>
                            <img src={fingerprint} alt="Fingerprint" className='object-cover h-10 w-10 md:h-12 md:w-12 rounded-lg' />
                            <h1 className='font-syne text-3xl md:text-4xl font-bold text-forge-darkGreen'>
                                Reset Password
                            </h1>
                        </div>
                        <p className='font-poppins tracking-tight text-sm md:text-[18px]'>
                            Please enter your new password.
                        </p>

                        <div className="flex flex-col mt-4">
                            <label className="font-poppins text-sm md:text-[15px] text-gray-700">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    className="mt-2 px-4 py-2 w-full border rounded-md text-sm md:text-base"
                                />
                                <div
                                    className="absolute right-3 top-3 cursor-pointer"
                                    onClick={() => toggleShowPassword('new')}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col mt-4">
                            <label className="font-poppins text-sm md:text-[15px] text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-2 px-4 py-2 w-full border rounded-md text-sm md:text-base"
                                />
                                <div
                                    className="absolute right-3 top-3 cursor-pointer"
                                    onClick={() => toggleShowPassword('confirm')}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleContinue}
                            className='bg-forge-darkGreen mt-6 font-poppins px-8 md:px-10 w-full text-white text-sm md:text-[15px] font-normal h-10 md:h-11 rounded-md'>
                            Continue
                        </Button>

                        <Separator className='mt-6 w-full md:w-[1020px]' />

                        <div className="flex items-center justify-center">
                            <div className="bg-forge-darkGreen p-1 rounded-md">
                                <FaEyeSlash className="text-white text-xs md:text-sm" />
                            </div>
                            <Link to={'/app/sign-in'} className='ml-2 text-forge-darkGreen font-poppins font-bold underline text-xs md:text-sm'>
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='hidden md:flex w-full md:w-1/2 h-full py-2 px-4'>
                    <div className='flex items-center justify-center w-full h-full relative'>
                        <img src={Pattern} alt="Pattern" className='object-cover h-full w-full rounded-[30px]' />
                        <div className='absolute w-[95%] bottom-6 bg-green-900 bg-opacity-60 h-44 md:h-52 rounded-lg'>
                            <h3 className='font-syne font-bold text-2xl md:text-3xl text-white px-6 md:px-11 pt-6 md:pt-9 flex items-center gap-4'>
                                Streamline your workflow <Link to='/article'><BsArrowUpRightCircleFill className='size-12' /></Link>
                            </h3>
                            <p className='font-poppins text-white text-xs md:text-[18px] px-6 md:px-12'>
                                Logging in ensures you're always connected and up to date with your team. Let's continue making progress together!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
