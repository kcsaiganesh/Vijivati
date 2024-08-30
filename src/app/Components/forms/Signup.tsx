"use client";
import React, { ReactElement, useState } from "react";
import { post } from "../../utils/api";

const Signup = () => {
  const [signupDetails, setSignupDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (name === "confirm_password" || name === "password") {
      if (name === "confirm_password" && value !== signupDetails.password) {
        setError("Passwords do not match");
      } else if (
        name === "password" &&
        value !== signupDetails.confirm_password
      ) {
        setError("Passwords do not match");
      } else {
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await post("/auth/register", signupDetails);
      console.log("Signedup Succssfully :", response);
    } catch (error) {
      console.log("Signup Failed:", error);
    }
  };

  return (
    <div className="mx-auto bg-white rounded-xl w-1/4">
      <div className="border border-5 p-12 border-secondary rounded-xl ">
        <h1 className="flex justify-center font-raleway  text-xl">
          Registration Page
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={signupDetails.username}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={signupDetails.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={signupDetails.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm_password" className="block mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={signupDetails.confirm_password}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="mb-6 flex items-start space-x-3">
            <input type="checkbox" className="accent-primary" />
            <label htmlFor="terms" className="block leading-none mb-2">
              Accept terms & policies of vijivati
            </label>
          </div>
          <button className="bg-primary p-2 w-full text-white py-2 px-4 rounded">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
