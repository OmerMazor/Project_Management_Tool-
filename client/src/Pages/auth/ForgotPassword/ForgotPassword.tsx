import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskForge from '../../../assets/Taskforge.png'
import ForgotImg from '../../../assets/Forgot.jpg'
import FingerprintIcon from '../../../assets/Fingerprint.png'
import toast from 'react-hot-toast'
import { ForgotPasswordapi } from '@/services/api.services'
import { ForgotPasswordResponse } from '@/types/authenticationTypes'

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isResendLoading, setIsResendLoading] = useState(false)
    const [isCooldown, setIsCooldown] = useState(false)
    const [isResendCooldown, setIsResendCooldown] = useState(false)
    const navigate = useNavigate()

    const handleResetPassword = async () => {
        if (!email) {
            toast.error('Please enter your email.')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.')
            return
        }

        setIsLoading(true)

        try {
            const response: ForgotPasswordResponse = await ForgotPasswordapi({ emailAddress: email })

            if (response.success) {
                toast.success('Reset instructions sent to your email.')
                setIsCooldown(true)

                setTimeout(() => {
                    setIsCooldown(false)
                }, 45000)
            } else {
                toast.error(response.message || 'Please check your email again.')
            }
        } catch (error) {
            console.error('Error during forgot password:', error)
            toast.error('An error occurred during forgot password. Please check the email address.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendEmail = async () => {
        if (isResendCooldown) {
            toast.error('Please wait before resending the email.')
            return
        }

        setIsResendLoading(true)
        setIsResendCooldown(true)

        try {
            const response: ForgotPasswordResponse = await ForgotPasswordapi({ emailAddress: email })

            if (response.success) {
                toast.success('Reset email resent successfully!')
                setEmail('')
            } else {
                toast.error(response.message || 'Failed to resend the email. Please check your email again.')
            }
        } catch (error) {
            toast.error('An error occurred while resending the email. Please try again.')
        } finally {
            setIsResendLoading(false)

            setTimeout(() => {
                setIsResendCooldown(false)
            }, 15000)
        }
    }

    return (
        <div className="max-w-full min-h-screen">
            <div className="flex flex-col md:flex-row h-screen">
                <div className="w-full md:w-1/2 h-full p-6 bg-gray-50 relative">
                    <img
                        src={TaskForge}
                        alt="TaskForge"
                        className="w-28 mb-6"
                    />

                    <div className="absolute top-6 right-6">
                        <button
                            onClick={() => navigate('/app/sign-up')}
                            className="font-poppins text-sm font-medium text-black hover:underline">
                            Create an account
                        </button>
                    </div>

                    <div className="mt-12 md:mt-16 p-5">
                        <div className="flex justify-start mb-6">
                            <img
                                src={FingerprintIcon}
                                alt="Fingerprint Icon"
                                className="h-12 w-12 md:h-16 md:w-16"
                            />
                        </div>
                        <h1 className="font-syne text-3xl md:text-5xl font-bold text-forge-darkGreen mb-2 text-left">Forgot Password?</h1>
                        <p className="font-poppins tracking-tight text-sm md:text-[22px] font-normal mb-6 text-left">
                            No worries, we'll send you reset instructions.
                        </p>

                        <div className="flex flex-col">
                            <label
                                htmlFor="email"
                                className="block text-left font-bold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. example@gmail.com"
                                className="p-2 border border-gray-300 rounded-lg mb-4"
                                style={{ width: '75%' }}
                            />

                            <button
                                onClick={handleResetPassword}
                                disabled={isLoading || isCooldown}
                                className={`w-3/4 bg-forge-darkGreen text-white py-2 rounded-lg hover:bg-forge-green transition duration-200 ${
                                    isLoading || isCooldown ? 'cursor-not-allowed opacity-50' : ''
                                }`}>
                                {isLoading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </div>

                        <div className="mt-4 flex justify-start space-x-2">
                            <span>Did you get the email? </span>
                            <span
                                onClick={handleResendEmail}
                                className={`cursor-pointer hover:underline font-poppins text-sm font-medium text-forge-darkGreen hover:underline underline decoration-forge-darkGreen ${
                                    isResendLoading || isResendCooldown ? 'cursor-not-allowed opacity-50' : ''
                                }`}>
                                {isResendLoading ? 'Resending...' : 'Resend Email'}
                            </span>
                        </div>

                        <div className="mt-4 flex justify-start">
                            <button
                                onClick={() => navigate('/app/sign-in')}
                                className="font-poppins text-sm font-medium text-forge-darkGreen hover:underline underline decoration-forge-darkGreen">
                                Back to login
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex w-full md:w-1/2 h-full py-2 px-4">
                    <div className="flex items-center justify-center w-full h-full relative">
                        <img
                            src={ForgotImg}
                            alt="Forgot Password"
                            className="object-cover h-full w-full rounded-[30px]"
                        />
                        <div className="absolute w-[90%] bottom-6 bg-green-900 bg-opacity-70 h-52 rounded-lg">
                            <h3 className="font-syne font-bold text-3xl text-white px-11 pt-9 flex items-center gap-4 mb-2">
                                Streamline your <br /> workflow
                            </h3>
                            <p className="font-poppins text-white font-normal tracking-tight text-[18px] px-12">
                                Logging in ensures you're always connected and up to date with your team. Let's continue making progress together.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword

