"use client";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../../../public/assests/Images/Vijivati-logo.png";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-dark text-white ">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center px-4 py-4">
        <div className="flex  md:left-0 justify-between items-center">
          <Image
            src={Logo}
            alt="Logo"
            width={60}
            height={60}
            className="scale-150"
          />
          <button
            className="md:hidden ml-4 absolute right-0 text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <nav className={`md:flex ${isMenuOpen ? "block" : "hidden"} md:block`}>
          <ul className="flex flex-col md:flex-row md:space-x-10 text-center space-y-4 md:space-y-0">
            <li>
              <Link className="font-raleway text-lg" href="/">
                Report-Animal
              </Link>
            </li>
            <li>
              <Link className="font-raleway text-lg" href="/about">
                Adoption
              </Link>
            </li>
            <li>
              <Link className="font-raleway text-lg" href="/contact">
                Donate
              </Link>
            </li>
            <li>
              <Link className="font-raleway text-lg" href="/login">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden  fixed inset-0 bg-dark text-white ${
          isMenuOpen ? "block h-[25vh]" : " hidden "
        } transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } ease-in-out duration-300`}
      >
        {/* Menu Toggle Button */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* Menu Items */}
        <ul
          className={`flex flex-col items-center space-y-4 mt-16 ${
            isMenuOpen ? "h-[100%]" : "h-0"
          } overflow-hidden`}
        >
          <li>
            <Link
              className="font-raleway text-lg"
              href="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Report-Animal
            </Link>
          </li>
          <li>
            <Link
              className="font-raleway text-lg"
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              Adoption
            </Link>
          </li>
          <li>
            <Link
              className="font-raleway text-lg"
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate
            </Link>
          </li>
          <li>
            <Link
              className="font-raleway text-lg"
              href="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Navbar;
