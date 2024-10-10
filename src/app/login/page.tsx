"use client";
import React, { useState } from "react";
import TermsModal from "../Components/ui/TermsModel";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-center space-y-12 min-h-screen mx-auto">
      <div className="">
        <h2 className="text-2xl font-medium text-center">
          Login to your Account
        </h2>
      </div>

      <div className="flex flex-col  justify-center mx-auto space-y-4">
        <div className="flex flex-col space-y-4 ml-4">
          <input
            className="w-auto h-[4vh] bg-primary rounded px-2 focus:outline-none"
            placeholder="username/email"
            type="text"
          />
          <input
            className="w-auto h-[4vh] bg-primary rounded px-2 focus:outline-none"
            placeholder="password"
            type="password"
          />
        </div>
        <div className="flex items-center ml-4  space-x-2">
          <input
            className="text-left accent-cta "
            type="checkbox"
            id="rememberMe"
          />
          <label htmlFor="rememberMe" className="text-sm  select-none">
            Remember me
          </label>
        </div>
        <div className=" flex items-center ml-4 space-x-2">
          <input className="text-left accent-cta " type="checkbox" id="t&c" />
          <label htmlFor="t&c" className="text-sm  select-none">
            Accepted the terms & conditions
            <a
              onClick={handleOpenModal}
              className="underline underline-offset-1 px-2 cursor-pointer"
            >
              here
            </a>
          </label>
        </div>
      </div>

      <div className="text-center">
        <button className="w-auto h-[4vh] ml-4 bg-cta py-auto px-10 rounded">
          Login
        </button>
      </div>
      <TermsModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Page;
