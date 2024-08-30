import React from "react";
import Image from "next/image";
import HeroImage from "../../public/assests/Images/hero-images.jpg";
import Paw from "../../public/assests/Images/paw.png";
import ReportImg from "../../public/assests/Images/icons8-vet-24.png";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col px-4 ">
        <div className="flex flex-col md:flex-row md:justify-around space-x-5 my-16 md:mx-16 md:my-16 border border-b-4  ">
          <div className="flex flex-col space-y-14 flex-1">
            <div className="space-y-6">
              <h2 className="font-raleway text-gradient font-bold text-3xl md:text-6xl py-4">
                Together, We Can Build a Brighter Future for Every Stray Animal
                in Need!
              </h2>
              <p className="font-raleway text-primary font-medium text-lg md:text-xl">
                Report, Adopt, Donate, and Learn - All in One Place
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-14 ">
              <button className="bg-cta place-content-center font-bold text-base md:text-xl antialiased text-black px-6 md:px-10 py-3 md:py-4 flex items-center space-x-4">
                <span>Report</span>
                <Image
                  className="w-5 h-5 md:w-6 md:h-6"
                  src={ReportImg}
                  alt="report"
                />
              </button>
              <button className="bg-cta  place-content-center font-bold text-base md:text-xl focus:ring-offset-1 antialiased text-black px-6 md:px-10 py-3 md:py-4 flex items-center space-x-4">
                <span>Adopt</span>
                <Image className="w-5 h-5 md:w-6 md:h-6" src={Paw} alt="paw" />
              </button>
            </div>
          </div>
          <div className="flex   flex-1  md:mt-0 mt-8">
            <div className="w-full md:w-[40vw] h-[50vh] md:h-[40%] rounded-[30px] md:rounded-[59px] drop-shadow-2xl shadow-dark overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={HeroImage}
                alt="banner"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
