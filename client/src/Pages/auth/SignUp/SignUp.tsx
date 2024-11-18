import React, { useState } from 'react';
import TaskForge from '../../../assets/Taskforge.png';
import { Button } from '@/components/ui/button';
import GoogleIcon from '../../../assets/googleIcon.png';
import GithubIcon from '../../../assets/githubicono.png';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import 'react-phone-number-input/style.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneInput from 'react-phone-number-input';
import { RiErrorWarningFill } from "react-icons/ri";
import SignupImg from '../../../assets/SignUp.jpg';
import { signupSchema } from '@/helper/Validation';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { E164Number } from 'libphonenumber-js';
import { Link,useNavigate } from 'react-router-dom';
import { SignUpapi } from '@/services/api.services';
import toast from 'react-hot-toast';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [phoneValue, setPhoneValue] = useState<E164Number | undefined>();

 
  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onChange'
  });

  const handlePhoneChange = (value: E164Number | undefined) => {
    setPhoneValue(value);
    setValue('phoneNumber', value || '');
  };

  const onSubmit = async (data: any) => {
    const { name, emailAddress, phoneNumber, password, consent } = data;
    const formattedPhoneNumber = phoneNumber.replace('+', '');
    try {
      const payload = { name, emailAddress, phoneNumber: formattedPhoneNumber, password, consent };
      const resp = await SignUpapi(payload);
      if (resp.success) {
        toast.success('Confirmation email sent successfully');
        navigate('/app/confirmation')
      } else {
        toast.error('Sign-up failed, please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during sign-up.');
      console.error('Error during sign-up:', error);
    }
  };


  return (
      <div className='max-w-full min-h-screen'>
        <div className='flex flex-col md:flex-row h-screen'>
          <div className='w-full md:w-1/2 h-full p-2 overflow-y-auto'>
            <img src={TaskForge} alt="TaskForge" className='w-32' />
            <div className='flex flex-col mt-8 md:mt-16 md:px-12 gap-5'>
              <div>
                <h1 className='font-syne text-4xl font-bold text-forge-darkGreen'>Get Started </h1>
                <p className='font-poppins tracking-tight text-[18px] font-normal'>Organize. Collaborate. Achieve.</p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button variant="outline" className='flex items-center justify-center gap-2 font-poppins tracking-tight w-full sm:w-auto'>
                  <img src={GoogleIcon} alt="" className='w-6' />Sign in with Google
                </Button>
                <Button variant="outline" className='flex items-center justify-center gap-2 font-poppins text-[13px] md:text-[14px] tracking-tight w-full sm:w-auto'>
                  <img src={GithubIcon} alt="" className='w-10' />Sign in with Github
                </Button>
              </div>
              <Separator className='mt-2 w-full' />

              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full'>
                <div className='flex flex-col gap-5'>
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor='name' className='font-poppins text-[15px] font-normal'>Name</Label>
                    <input 
                      type='text' 
                      {...register('name')} 
                      placeholder='Andrea' 
                      className='w-full h-11 focus-visible:outline-none pl-4 rounded-md font-poppins text-[14px] border border-forge-input-border' 
                    />
                    {errors.name && (
                      <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'>
                        <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-5'>
                  <div className='flex flex-col gap-1 w-full md:w-1/2'>
                    <Label htmlFor='email' className='font-poppins text-[15px] font-normal'>Email</Label>
                    <input 
                      type='email' 
                      {...register('emailAddress')} 
                      placeholder='andreawilliams@gmail.com' 
                      className='w-full h-11 focus-visible:outline-none pl-4 rounded-md font-poppins text-[14px] border border-forge-input-border' 
                    />
                    {errors.emailAddress && (
                      <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'>
                        <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.emailAddress.message}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col gap-1 w-full md:w-1/2'>
                    <Label htmlFor='phoneNumber' className='font-poppins text-[15px] font-normal'>Phone Number</Label>
                    <PhoneInput 
                      value={phoneValue} 
                      onChange={handlePhoneChange} 
                      className='w-full bg-white focus:outline-none focus:ring-0 font-poppins text-[14px] h-11 rounded-md px-3 border border-dark-500' 
                    />
                    {errors.phoneNumber && (
                      <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'>
                        <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-5'>
                  <div className='flex flex-col gap-1 w-full md:w-1/2'>
                    <Label htmlFor='password' className='font-poppins text-[15px] font-normal'>Password</Label>
                    <div className='flex items-center relative'>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        {...register('password')} 
                        className='w-full h-11 focus-visible:outline-none px-4 rounded-md font-poppins text-[14px] border border-forge-input-border' 
                      />
                      <span className='absolute right-3 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEye className='text-forge-darkGreen' /> : <FaEyeSlash className='text-forge-darkGreen' />}
                      </span>
                    </div>
                    {errors.password && (
                      <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'>
                        <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col gap-1 w-full md:w-1/2'>
                    <Label htmlFor='confirmPassword' className='font-poppins text-[15px] font-normal'>Confirm Password</Label>
                    <div className='flex items-center relative'>
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        {...register('confirmPassword')} 
                        className='w-full h-11 focus-visible:outline-none px-4 rounded-md font-poppins text-[14px] border border-forge-input-border' 
                      />
                      <span className='absolute right-3 cursor-pointer' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FaEye className='text-forge-darkGreen' /> : <FaEyeSlash className='text-forge-darkGreen' />}
                      </span>
                    </div>
                    {errors.confirmPassword && (
                      <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'>
                        <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <input 
                    type='checkbox' 
                    {...register('consent')} 
                    className='h-5 w-5 border-gray-300 rounded-md text-forge-darkGreen focus:ring-forge-darkGreen' 
                  />
                  <Label htmlFor='consent' className='font-poppins text-[15px] font-normal'>
                    I agree to the <Link to="/terms" className="text-forge-darkGreen">terms and conditions</Link>
                  </Label>
                </div>
                {errors.consent && (
                  <p className='font-poppins font-normal text-yellow-600 text-[13px] flex gap-1 items-center'>
                    <RiErrorWarningFill className='text-yellow-600 size-4' /> {errors.consent.message}
                  </p>
                )}

                <div className='mt-4'>
                  <Button type='submit' disabled={!isValid} className='bg-forge-darkGreen text-white py-3 rounded-md w-full font-poppins'>
                    Sign Up
                  </Button>
                </div>
              </form>
              
              <div className='mt-4'>
                <p className='font-poppins text-[15px] font-normal'>
                  Already have an account? <Link to="/app/sign-in" className='text-forge-darkGreen'>Log in here.</Link>
                </p>
              </div>
            </div>
          </div>

          <div className='hidden md:block w-1/2'>
            <img src={SignupImg} alt="Sign up" className='w-full h-full object-cover' />
          </div>
        </div>
      </div>
  );
};

export default SignUp;
