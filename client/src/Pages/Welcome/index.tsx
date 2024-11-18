import React from 'react';
import TaskForge from '../../assets/Taskforge.png';

function Welcome() { 
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 w-full sm:w-3/4 lg:w-1/2 text-center">
        <img src={TaskForge} alt="Task Forge" className="w-40 sm:w-52" />
        <h2 className="font-bold font-syne text-xl sm:text-2xl lg:text-3xl text-gray-800 tracking-tight">
          Welcome to all-in-one open source project management platform
        </h2>
        <p className="font-poppins text-sm sm:text-base text-gray-600 tracking-tight">
          Enjoy the best of all with one-time payment
        </p>
      </div>
    </div>
  );
}

export default Welcome;
