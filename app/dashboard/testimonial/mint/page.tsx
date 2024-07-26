"use client";

import { PreviewText } from "@/components/Form3";
import Image from "next/image";
import { useRef, useState } from "react";
//import html2canvas from "html2canvas";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function Page() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [image, _setImage] = useState("/F4EN7tcXUAEC-5Y.jpg");
  //   const convertToDataURL = async () => {
  //     if (cardRef.current) {
  //       const dataurl = (
  //         await html2canvas(cardRef.current, { useCORS: true })
  //       ).toDataURL();
  //       return dataurl;
  //     }
  //   };
  return (
    <div className={`flex w-full h-[calc(100vh-97px)] justify-center`}>
      <div
        className={`xl:w-[450px] lg:w-[450px] md:w-[430px] w-[300px] h-full block space-y-[27px] xl:p-[20px] lg:p-[20px] md:p-[17px] p-[15px]`}
      >
        <div
          ref={cardRef}
          className={`xl:w-[400px] lg:w-[400px] md:w-[400px] w-[300px] bg-[rgba(0,72,255,0.14)] space-y-2 backdrop-filter backdrop-blur-lg relative xl:h-[510px] lg:h-[510px] md:h-[510px] h-[360px] block mx-auto shadow-xl rounded-[10px] lg:p-[10px] xl:p-[10px] md:p-[10px] p-[7px]`}
        >
          <div
            className={`w-full xl:h-[350px] lg:h-[350px] md:h-[350px] h-[200px] rounded-[10px] block mx-auto`}
          >
            {image && (
              <Image
                src={image}
                width={300}
                height={300}
                alt="Nft Image"
                className={`w-full xl:h-[350px] lg:h-[350px] md:h-[350px] h-[200px] rounded-[10px] block mx-auto`}
              />
            )}
          </div>
          <div
            className={`xl:h-[40px] lg:h-[40px] md:h-[30px] h-[20px] w-full flex justify-between px-[10px] items-center`}
          >
            <PreviewText
              value={"Lorem ipsum"}
              className={`font-bold text-[17px]`}
            />
            <div className={`flex items-center space-x-1`}>
              <div
                className={`w-fit h-fit space-x-1 items-center justify-center rounded-lg text-end flex mx-auto`}
              >
                <LocationOnIcon fontSize="small" />
                <p className={`text-[15px]`}>United states, New York</p>
              </div>
            </div>
          </div>
          <div
            className={`text-start px-[7px] xl:w-[350px] lg:w-[350px] md:w-[350px] w-[290px]`}
          >
            <p
              className={`italc xl:text-[11px] 2xl:text-[11px] text-[9px] lg:text-[11px] md:text-[11px] break-words w-full`}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut ipsa
              odio necessitatibus animi, cum esse corporis accusantium debitis
              culpa. Natus expedita consequatur sapiente at dolore commodi
              repudiandae nam, modi sint.
            </p>
          </div>
          <p className={`absolute bottom-3 right-3 font-bold`}>#69</p>
        </div>
        <button
          type="button"
          className={`w-[100px] h-[40px] mx-auto block shadow-xl bg-indigo-600 text-white rounded-[5px]`}
        >
          Mint
        </button>
      </div>
    </div>
  );
}

export default Page;
