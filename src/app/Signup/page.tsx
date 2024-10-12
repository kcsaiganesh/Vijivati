"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleIcon from "../../../public/assests/Images/google.png";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const history = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Make an API call to register the user
    try {
      const response = await fetch("YOUR_API_ENDPOINT/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      // Redirect to the login page or another page upon successful signup
      history.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen ">
      <div className="space-y-12">
        <h2 className="text-2xl font-medium text-center">
          Create a new Account
        </h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center text-center space-y-4"
        >
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username/email"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full max-w-xs h-[4vh] bg-primary rounded px-2 focus:outline-none"
          />

          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full max-w-xs h-[4vh] bg-primary rounded px-2 focus:outline-none"
          />

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full max-w-xs h-[4vh] bg-primary rounded px-2 focus:outline-none"
          />

          <div className="pt-8">
            <button
              type="submit"
              className="w-auto h-[4vh]   bg-cta  px-10 rounded"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-2 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-black underline underline-offset-1">
            Login
          </a>
        </p>
        <div className="flex items-center justify-center  my-6">
          <div className="border-t border-secondary w-[15vw]"></div>
          <span className="mx-4 ">Or </span>
          <div className="border-t border-secondary w-[15vw]"></div>
        </div>
        <div
          className="mx-auto cursor-pointer text-center py-2"
          onClick={() => {}}
        ></div>
      </div>
      <div className="flex flex-row  space-x-4 py-4 px-3    rounded h-auto w-auto bg-secondary">
        <Image src={GoogleIcon} alt="googleicon" width={25} height={25}></Image>
        <p className="flex-none">SignUp with Google</p>
      </div>
    </div>
  );
};

export default SignupPage;
