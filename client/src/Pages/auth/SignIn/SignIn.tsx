import React, { useEffect } from 'react'; 
import { useState } from 'react';
import TaskForge from '../../../assets/Taskforge.png';
import { Button } from '@/components/ui/button';
import GoogleIcon from '../../../assets/googleIcon.png';
import GithubIcon from '../../../assets/githubicono.png';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import 'react-phone-number-input/style.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RiErrorWarningFill } from "react-icons/ri";
import SignInImg from '../../../assets/SignIn.jpg';
import { SigninSchema } from '@/helper/Validation';
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import toast from 'react-hot-toast';
import { SignInapi } from '@/services/api.services';
import { SignInData, SignInResponse } from '@/types/authenticationTypes';

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(SigninSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const isExpired = Date.now() >= payload.exp * 1000;
  
      if (!isExpired) {
        navigate('/welcome');
      }
    }
  }, [navigate]);
  
  const onSubmit = async (data: SignInData) => {
    const response: SignInResponse = await SignInapi(data);
  
    if (response.success && response.data) { 
      const { accessToken, refreshToken } = response.data;
  
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        navigate('/welcome');
        toast.success('Login Successful');
      }
    } else {
      toast.error('Login failed, please check your credentials.');
    }
  };
  

  return (
    <div className='max-w-full min-h-screen'>
      <div className='flex flex-col md:flex-row h-screen'>
        {/* Left side */}
        <div className='w-full md:w-1/2 h-full p-6'>
          <div className='flex justify-between items-center'>
            <img src={TaskForge} alt="" className='w-32' />
            <Link to="/app/sign-up" className='text-lg font-bold text-gray-800 underline font-roboto'>
              Create an account
            </Link>
          </div>
          <div className='flex flex-col mt-[70px] md:px-12 gap-5'>
            <div>
              <h1 className='font-syne text-4xl font-bold text-forge-darkGreen'>Welcome Back </h1>
              <p className='font-poppins tracking-tight text-[18px] font-normal'>Enter your TaskForge account details</p>
            </div>
            <div className='flex md:gap-4 gap-2 '>
              <Button variant="outline" className='flex items-center gap-2 font-poppins tracking-tight'> <img src={GoogleIcon} alt="" className='w-6' />Sign in with Google</Button>
              <Button variant="outline" className='flex items-center md:gap-1 font-poppins text-[13px] md:text-[14px] tracking-tight pr-6 md:pr-8'> <img src={GithubIcon} alt="" className='w-10' />Sign in with Github</Button>
            </div>
            <Separator className=' mt-2 md:w-[560px]' />
            <div className='flex flex-col w-full'>
              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full'>
                <div className='flex gap-5 flex-col md:flex-row '>
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor='name' className='font-poppins text-[15px] font-normal'>Email</Label>
                    <input type='email' {...register('emailAddress')} placeholder='andreawilliams@gmail.com' className='w-full md:max-xl:w-[300px] xl:w-[280px] h-11 focus-visible:outline-none pl-4 rounded-md font-poppins text-[14px] border border-forge-input-border' />
                    {errors.emailAddress && (
                      <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'> <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.emailAddress.message}</p>
                    )}
                  </div>
                </div>
                <div className='flex gap-5 flex-col xl:flex-row md:max-xl:flex-row '>
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor='name' className='font-poppins text-[15px] font-normal'>Password</Label>
                    <div className='flex items-center relative'>
                      <input type={showPassword ? 'text' : 'password'} {...register('password')} className='w-full xl:w-[280px] md:max-xl:w-[300px] h-11 focus-visible:outline-none px-4 rounded-md font-poppins text-[14px] border border-forge-input-border' />
                      <span className='absolute right-3 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEye className='size-5 text-forge-darkGreen' /> : <FaEyeSlash className='size-5 text-forge-darkGreen' />}</span>
                    </div>
                    {errors.password && (
                      <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'> <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.password.message}</p>
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <Link to='/app/forgot-password' className='text-forge-darkGreen font-poppins italic underline'>Forget Password? </Link>
                </div>
                <div className='flex flex-col items-center'>
                  <Button disabled={!isValid} className={`bg-forge-darkGreen mt-8 mb-12 font-poppins px-16 w-full xl:w-[400px] text-white text-[15px] font-normal h-11 rounded-md text-center ${!isValid ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>Sign In</Button>
                  <p className='font-poppins tracking-tight font-bold underline'>Trouble Signing in? </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Right Image */}
        <div className='hidden md:max-xl:hidden md:flex w-full md:w-1/2 h-full py-2 px-4'>
          <div className='flex items-center justify-center w-full h-full relative'>
            <img src={SignInImg} alt="" className='object-cover h-full w-full rounded-[30px]' />
            <div className='absolute w-[96%] bottom-6 bg-green-900 bg-opacity-60 h-52 rounded-lg'>
              <h3 className='font-syne font-bold text-3xl text-white px-11 pt-9 flex items-center gap-4 mb-2'>Streamline your workflow <Link to='/article'><BsArrowUpRightCircleFill className='size-12' /></Link></h3>
              <p className='font-poppins text-white font-normal tracking-tight text-[18px] px-12'>
                Logging in ensures you're always connected and up to date with your team. Let's continue making progress
                together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn;
