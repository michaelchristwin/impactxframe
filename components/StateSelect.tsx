import React, { Dispatch, SetStateAction } from "react";
import { FormState } from "./Form3";
import { Label } from "./ui/label";
import {
  SelectContent,
  SelectTrigger,
  Select,
  SelectValue,
  SelectItem,
} from "./ui/select";
import CoutriesJSON from "@/utils/countries.json";

interface StateSelectProps {
  country: string;
  setState: Dispatch<SetStateAction<FormState>>;
  value: string;
}

const StateSelect = React.memo(
  ({ country, setState, value }: StateSelectProps) => {
    const data: any = Array.from(JSON.parse(JSON.stringify(CoutriesJSON))).find(
      (item: any) => item.name === country
    );

    const onValueChange = (value: string) => {
      setState((p) => ({
        ...p,
        state: value,
      }));
    };
    return (
      <div className={`w-full space-y-[80px]`}>
        <fieldset className={`w-full space-y-2`}>
          <Label
            className={`flex items-center space-x-1 xl:text-[17px] lg:text-[17px] md:text-[17px] text-[15px] font-bold`}
          >
            <span className={``}>5</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="#000000"
              viewBox="0 0 16 16"
              className="shouldFlipIfRtl"
            >
              <path d="M8.47 1.97a.75.75 0 0 1 1.06 0l4.897 4.896a1.25 1.25 0 0 1 0 1.768L9.53 13.53a.75.75 0 0 1-1.06-1.06l3.97-3.97H1.75a.75.75 0 1 1 0-1.5h10.69L8.47 3.03a.75.75 0 0 1 0-1.06"></path>
            </svg>
            <span>Select recipient&apos;s state</span>
          </Label>
          <Select
            name="location_state"
            disabled={!country}
            onValueChange={onValueChange}
            value={value}
          >
            <SelectTrigger className={`w-full focus:!ring-0 h-[50px]`}>
              <SelectValue placeholder={`Select your state`} />
            </SelectTrigger>
            <SelectContent>
              {data &&
                Array.from(data.states).map((item: any, index) => (
                  <SelectItem value={item.name} key={index}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </fieldset>
        <div className={`flex mx-auto w-fit items-center space-x-2 px-2`}>
          <button
            disabled
            className={`w-[120px] flex disabled:opacity-[0.3] justify-center space-x-[6px] bg-black h-[30px] rounded-[4px] text-white items-center`}
          >
            <svg
              fill="#ffffff"
              height="12px"
              width="12px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 455 455"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <polygon points="455,212.5 242.5,212.5 242.5,0 212.5,0 212.5,212.5 0,212.5 0,242.5 212.5,242.5 212.5,455 242.5,455 242.5,242.5 455,242.5 "></polygon>
              </g>
            </svg>
            <p>Add to batch</p>
          </button>
          <button
            className={`w-[120px] flex justify-center bg-black h-[30px] rounded-[4px] text-white items-center`}
          >
            Mint
          </button>
        </div>
      </div>
    );
  }
);
StateSelect.displayName = "StateSelect";
export default StateSelect;
