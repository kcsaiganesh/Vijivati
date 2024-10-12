"use client";
import React, { useState } from "react";
import TermsModal from "../Components/ui/TermsModel";
import Image from "next/image";
import GoogleIcon from "../../../public/assests/Images/google.png";

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
        <div className="flex items-center ml-4  space-x-2 r">
          <input
            className="text-left accent-cta cursor-pointe  "
            type="checkbox"
            id="rememberMe"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm cursor-pointer  select-none"
          >
            Remember me
          </label>
        </div>
        <div className=" flex items-center ml-4 space-x-2">
          <input
            className="text-left cursor-pointer accent-cta "
            type="checkbox"
            id="t&c"
          />
          <label htmlFor="t&c" className="text-sm cursor-pointer  select-none">
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

      <div className="text-center ">
        <button className="w-auto h-[4vh] ml-4 bg-cta py-auto px-10 rounded">
          Login
        </button>
        <p className="mt-10 text-center  ">
          New to Vijivati, Signup
          <a
            href="/Signup"
            className="text-black underline pl-2 underline-offset-1"
          >
            here
          </a>
        </p>
      </div>
      <div className="flex items-center justify-center  w-full my-6">
        <div className="border-t border-secondary w-[15vw]"></div>
        <span className="mx-4 ">Or </span>
        <div className="border-t border-secondary w-[15vw]"></div>
      </div>
      <div className="mx-auto cursor-pointer" onClick={() => {}}>
        <div className="flex flex-row space-x-4 py-4 px-3 rounded h-auto w-auto bg-secondary">
          <Image
            src={GoogleIcon}
            alt="googleicon"
            width={25}
            height={25}
          ></Image>
          <p>Sign in with Google</p>
        </div>
      </div>

      <TermsModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Page;
