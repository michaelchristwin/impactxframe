"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { RenderElement } from "./FormElements";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Image from "next/image";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

export interface FormState {
  name: string;
  description: string;
  image: string;
  country: string;
  state: string;
}

export const PreviewText = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  return (
    <div
      className={`w-fit h-fit items-center rounded-lg text-start ${
        value ? "flex" : "hidden"
      }`}
    >
      <p className={className}>{value}</p>
    </div>
  );
};

function Form3() {
  const initialState: FormState = {
    name: "",
    description: "",
    image: "",
    country: "",
    state: "",
  };
  const [viewImage, setViewImage] = useState({
    image: false,
  });

  const [formData, setFormData] = useState<FormState>(initialState);

  const [currentView, setCurrentView] = useState(0);
  const { name, description, image, country, state } = formData;
  return (
    <div
      className={`lg:flex md:flex xl:flex block items-center space-y-2 w-full xl:h-[calc(97vh-70px)] lg:h-[calc(97vh-70px)] md:h-[calc(97vh-70px)] h-[calc(97vh-70px)] justify-between`}
    >
      <div
        className={`lg:h-[100%] sideProg md:h-[100%] xl:h-[100%] h-[49.8%] lg:w-[49.8%] md:w-[49.8%] xl:w-[49.8%] w-full mx-auto space-y-2 block bg-white xl:p-[20px] lg:p-[20px] md:p-[15px] p-[9px]`}
      >
        <p className={`text-[18px] font-bold text-center`}>Preview</p>

        <div
          className={`xl:w-[400px] lg:w-[400px] md:w-[400px] w-[300px] bg-[rgba(0,72,255,0.14)] backdrop-filter backdrop-blur-lg relative xl:h-[510px] lg:h-[510px] md:h-[510px] h-[92%] block mx-auto shadow-xl rounded-lg lg:p-[10px] xl:p-[10px] md:p-[10px] p-[7px]`}
        >
          <div
            className={`w-full xl:h-[350px] lg:h-[350px] md:h-[350px] h-[150px] rounded-[10px] block mx-auto`}
          >
            {image && (
              <Image
                src={image}
                width={300}
                height={300}
                alt="Nft Image"
                className={`w-full xl:h-[350px] lg:h-[350px] md:h-[350px] h-[150px] rounded-[10px] block mx-auto`}
              />
            )}
          </div>
          <div
            className={`xl:h-[40px] lg:h-[40px] md:h-[30px] h-[20px] w-full flex justify-between px-[10px] items-center`}
          >
            <PreviewText value={name} className={`font-bold c`} />
            <div className={`flex items-center space-x-1`}>
              <div
                className={`w-fit h-fit space-x-1 items-center justify-center rounded-lg text-end ${
                  country ? "flex" : "hidden"
                } mx-auto`}
              >
                <LocationOnIcon />
                <p className={``}>
                  {country}, {state}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`text-start px-[7px] xl:w-[350px] lg:w-[350px] md:w-[350px] w-[290px]`}
          >
            <p className={`italc text-[11px] break-words w-full`}>
              {description}
            </p>
          </div>
          <p className={`absolute bottom-3 right-3 font-bold`}>#69</p>
        </div>
      </div>
      <form
        className={`lg:w-[49.8%] md:w-[49.8%] xl:w-[49.8%] w-full relative bg-white lg:h-full md:h-full xl:h-full h-[49.8%]`}
      >
        <AnimatePresence>
          <RenderElement
            setFormData={setFormData}
            formData={formData}
            viewImage={viewImage}
            setViewImage={setViewImage}
            key={currentView}
            index={currentView}
          />
        </AnimatePresence>
        <div
          className={`w-[105px] space-x-1 flex absolute xl:bottom-[40px] lg:bottom-[40px] md:bottom-[20px] bottom-[10px] right-[10px]`}
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.9 }}
            disabled={currentView === 0}
            onClick={() => {
              setCurrentView((p) => {
                if (p > 0) {
                  return p - 1;
                }
                return p;
              });
            }}
            className={`rounded-full bg-black disabled:opacity-[0.2] shadow flex justify-center items-center xl:w-[35px] lg:w-[35px]
              md:w-[30px] w-[30px] lg:h-[35px] xl:h-[35px] md:h-[30px] h-[30px]`}
          >
            <svg
              fill="#ffffff"
              height="20px"
              width="15px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 330 330"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  id="XMLID_224_"
                  d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
                ></path>
              </g>
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.9 }}
            disabled={currentView === 4}
            type="button"
            onClick={() => {
              setCurrentView((p) => {
                if (p + 1 === 5) {
                  return p;
                }
                return p + 1;
              });
            }}
            className={`rounded-full bg-black disabled:opacity-[0.2] shadow flex justify-center items-center lg:w-[35px]
              md:w-[30px] w-[30px] lg:h-[35px] xl:h-[35px] md:h-[30px] h-[30px]`}
          >
            <svg
              fill="#ffffff"
              height="20px"
              width="15px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 330 330"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  id="XMLID_225_"
                  d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                ></path>
              </g>
            </svg>
          </motion.button>
        </div>
      </form>
    </div>
  );
}

export default Form3;
