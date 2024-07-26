import React, { useCallback } from "react";
import CoutriesJSON from "@/utils/countries.json";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Dispatch, SetStateAction } from "react";
import { FormState } from "./Form3";

interface CountrySelectProps {
  setState: Dispatch<SetStateAction<FormState>>;
  value: string;
}

const CountrySelect = React.memo(({ setState, value }: CountrySelectProps) => {
  const onValueChange = useCallback(
    (value: string) => {
      setState((p) => ({
        ...p,
        country: value,
      }));
    },
    [setState]
  );

  return (
    <fieldset className="w-full space-y-2">
      <Label
        htmlFor="location_country"
        className="flex items-center space-x-1 xl:text-[17px] lg:text-[17px] md:text-[17px] text-[15px] font-bold"
      >
        <span>4</span>
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
        <span>Select recipient&apos;s country</span>
      </Label>
      <Select
        name="location_country"
        onValueChange={onValueChange}
        value={value}
      >
        <SelectTrigger className="w-full focus:!ring-0 h-[50px]">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(JSON.parse(JSON.stringify(CoutriesJSON))).map(
            (item: any, index) => (
              <SelectItem value={item.name} key={index}>
                {item.name}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </fieldset>
  );
});
CountrySelect.displayName = "CountrySelect";
export default CountrySelect;
