"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  const handleClick = (routeName: string) => {
    router.push(routeName); // No need for template literal `${routeName}`
  };

  return (
    <div className="flex flex-col justify-around min-h-screen px-4">
      <div className="flex flex-col mx-auto text-center">
        <h2 className="text-2xl font-medium">Welcome to Vijivati</h2>
        <p>Lets make strays a better living</p>
      </div>

      <div className="flex flex-col space-y-4 mx-auto">
        <button
          onClick={() => handleClick("/login")}
          className="bg-cta  py-2 px-10 rounded"
        >
          Login
        </button>
        <button
          onClick={() => handleClick("/signup")}
          className="bg-secondary  py-2 px-10 rounded"
        >
          Signup
        </button>
      </div>

      <div className="flex flex-col mx-auto">
        <p
          onClick={() => handleClick("/dashboard")}
          className="underline underline-offset-2 cursor-pointer"
        >
          Continue as guest
        </p>
      </div>
    </div>
  );
};

export default Page;
