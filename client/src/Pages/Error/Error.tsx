import React from 'react';
import { Link } from 'react-router-dom';
import TaskForge from '../../assets/Taskforge.png';
import { FaExclamationTriangle } from 'react-icons/fa';

function Error() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="flex flex-col items-center gap-4 w-full sm:w-3/4 lg:w-1/2 text-center">
        <img src={TaskForge} alt="Task Forge" className="w-40 sm:w-52" />
        <FaExclamationTriangle className="text-6xl text-red-600 mb-4" />
        <h2 className="font-bold font-syne text-xl sm:text-2xl lg:text-3xl text-gray-800 tracking-tight">
          404 - Page Not Found
        </h2>
        <p className="font-poppins text-sm sm:text-base text-gray-600 tracking-tight">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link to="/" className="mt-4 text-forge-darkGreen underline hover:text-green-600 transition-all duration-200">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Error;
