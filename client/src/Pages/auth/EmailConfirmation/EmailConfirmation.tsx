import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TaskForge from '../../../assets/Taskforge.png';
import { AccountConfirmationapi } from '@/services/api.services';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const EmailConfirmation: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();

  useEffect(() => {
    if (token && code) {
      const confirmAccount = async () => {
        try {
          const response = await AccountConfirmationapi({
            token,
            code
          })
          if (response.success) {
            toast.success('Account confirmation successful');
            navigate('/app/sign-in');
          } else {
            toast.error('Account verification failed')
          }
        } catch (error) {
          toast.error('Account verification failed')
        }
      }
      confirmAccount();
    }
  }, [token, code, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6 w-full sm:w-3/4 lg:w-1/2 text-center">
        <img src={TaskForge} alt="Task Forge" className="w-40 sm:w-52" />

        {!token || !code ? (
          <>
            <h2 className="font-bold font-syne text-xl sm:text-2xl lg:text-3xl text-gray-800 tracking-tight">
              Kindly check your registered email
            </h2>
            <p className="font-poppins text-sm sm:text-base text-gray-600 tracking-tight">
              We have sent a confirmation email. Please follow the instructions to verify your account.
            </p>

            <div className="mt-4 flex justify-start">
              <button
                onClick={() => navigate('/app/sign-in')}
                className="font-poppins text-sm font-medium text-forge-darkGreen hover:underline underline decoration-forge-darkGreen"
              >
                Back to login
              </button>
            </div>
          </>
        ) : (
          <>
            <FaSpinner className="animate-spin text-forge-darkGreen text-4xl mb-4" />
            <h2 className="font-bold font-syne text-xl sm:text-2xl lg:text-3xl text-gray-800 tracking-tight">
              Verifying your email, please wait...
            </h2>
            <p className="font-poppins text-sm sm:text-base text-gray-600 tracking-tight">
              This process may take a few moments. Please be patient while we confirm your account.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
