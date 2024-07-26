"use client";

import { MutableRefObject, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { useAccount } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "@/config/wagmi";
import { parseEther, Address } from "viem";
import { Separator } from "@/components/ui/separator";
//import DateTimePicker from "react-datetime-picker";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Rowdies,
  Rubik_Bubbles,
  Luckiest_Guy,
  Oi,
  Bebas_Neue,
} from "next/font/google";
import Local from "next/font/local";
import { Field } from "@/components/Field";
import { handleKeyDown } from "@/utils/onKeyDown";
import FactoryABI from "@/ABIs/ImpactNFT.json";
import html2canvas from "html2canvas";
import handle from "@/utils/post-to-arweave";
import { MultiStepLoader } from "./ui/multi-step-loader";
import toast from "react-hot-toast";
const impactNftFactoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as any;

const _Comic_sans = Local({
  src: "../public/Ldfcomicsans-jj7l.ttf",
  weight: "600",
});
const _Rowdies = Rowdies({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const _Oi = Oi({
  weight: ["400"],
  subsets: ["latin"],
});

const _Rubik_Bubbles = Rubik_Bubbles({
  weight: ["400"],
  subsets: ["latin"],
});

const _Bebas_Neue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
});

const _Luckiest_Guy = Luckiest_Guy({
  weight: ["400"],
  subsets: ["latin"],
});

interface Inputs {
  title: string;
  description: string;
  image: File | undefined;
  coverImage: File | undefined;
  sharePercentage: number;
  quantity: number;
  price: number;
  someoneElse: string;
}
const loadingStates = [
  {
    text: "Uploading metadata...",
  },
  {
    text: "Executing transaction...",
  },
  {
    text: "Confirming Tx...",
  },
];
function CreateCollection() {
  const { address, isDisconnected } = useAccount();
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    quantity: 0,
    coverImage: undefined,
    image: undefined,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, laudantium rem soluta inventore provident expedita cum debitis adipisci id ab beatae, quae omnis? Quasi aliquid tempora ullam nostrum fugiat repudiandae.",
    price: 0,
    sharePercentage: 50,
    someoneElse: address as string,
  });
  const imageRef = useRef<HTMLDivElement | null>(null);
  const circleRadius = 30;
  const [font, setFont] = useState<string>(_Rowdies.className);

  const circleCircumference = 2 * Math.PI * circleRadius;
  const { quantity, title, price, description, sharePercentage, someoneElse } =
    inputs;
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setInputs((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const reduceIntensity = (hexColor: string, percentage: number) => {
    hexColor = hexColor.replace("#", "");

    // Convert hex to RGB
    let bigint = parseInt(hexColor, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    // Reduce intensity
    r = Math.round(r * (percentage / 100));
    g = Math.round(g * (percentage / 100));
    b = Math.round(b * (percentage / 100));

    // Convert back to hex
    let result =
      "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);

    return result;
  };
  const [cardColor, setCardColor] = useState<string | undefined>(undefined);
  const [txState, setTxState] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to return a promise that resolves when the user connects

  const convertToDataURL = async ({
    ref,
  }: {
    ref: MutableRefObject<HTMLDivElement | null>;
  }) => {
    try {
      if (ref.current) {
        // ref.current.style.width = "300px";
        // ref.current.style.height = "400px";
        const dataurl = (
          await html2canvas(ref.current, {
            backgroundColor: null,
          })
        ).toDataURL();
        return dataurl;
      } else {
        throw Error("imageRef is null");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isDisconnected) {
        toast.error("Connect your wallet");
        return;
      }
      setLoading(true);
      setTxState(0);

      const imageB64URI = await convertToDataURL({ ref: imageRef });
      if (!imageB64URI) {
        setLoading(false);
        throw Error("Invalid image");
      }
      const res = await handle({
        title: title,
        description: description,
        image: imageB64URI,
      });
      if (res.status === "fail") {
        setLoading(false);
        throw Error("Metadata upload failed");
      }
      console.log(res);
      setTxState(1);

      const _unitPrice = price.toString();
      const args = [
        BigInt(quantity),
        parseEther(_unitPrice, "wei"),
        address as Address,
        address as Address,
        res.data,
      ];
      console.log("Args:", args);
      const txHash = await writeContract(config, {
        abi: FactoryABI,
        address: impactNftFactoryAddress,
        functionName: "CreateImpactNFT",
        args: args,
      });

      setTxState(2);
      const txReciept = await waitForTransactionReceipt(config, {
        hash: txHash,
      });
      if (txReciept.status === "reverted") {
        setLoading(false);
        throw Error("Transaction reverted");
      }
      setLoading(false);
      toast.success("Transaction successfull");
    } catch (e) {
      setLoading(false);
      toast.error("Transaction failed");
      //@ts-ignore
      console.error("Error:", e.message, e.cause);
    }
  };

  const isValid = useCallback(() => {
    if (price > 0 && quantity > 0 && cardColor) {
      return false;
    } else return true;
  }, [price, quantity, cardColor]);

  return (
    <form
      className={`lg:md:flex block w-full h-[90%] justify-around py-[45px]`}
    >
      {/*<div
        className={`border relative lg:w-[600px] flex items-center justify-center md:w-[550px] lg:md:mx-0 mx-auto w-[300px] h-[500px] rounded-[10px]`}
      >
        <button
          type="button"
          onClick={() => {
            setViewImage(false);
          }}
          className={`w-[25px] ${
            viewImage ? "block" : "hidden"
          } z-10 h-[25px] flex justify-center items-center text-[20px] rounded-full bg-black text-white absolute top-3 right-3`}
        >
          ×
        </button>
        <Image
          src={dataUrl.image}
          alt="Nft Image"
          width={600}
          height={500}
          className={`lg:w-[600px] absolute ${
            viewImage ? "block" : "hidden"
          } top-0 right-0 md:w-[550px] w-[300px] h-[500px] rounded-[10px]`}
        />

        <Input
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          id="image"
          className={`file:bg-purple-200 ${
            !viewImage ? "block" : "hidden"
          } file:text-purple-700 border-0 w-[200px] file:h-[20px] file:rounded-[5px] file:border-0`}
        />
        <button
          type="button"
          onClick={() => {
            setViewImage(true);
          }}
          className={`absolute text-[12px] top-3 ${
            !viewImage && dataUrl.image ? "block" : "hidden"
          }`}
        >
          Preview
          <svg
            fill="#000000"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            height={30}
            width={30}
            className="block mx-auto"
            viewBox="0 0 442.04 442.04"
            xmlSpace="preserve"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <path d="M221.02,341.304c-49.708,0-103.206-19.44-154.71-56.22C27.808,257.59,4.044,230.351,3.051,229.203 c-4.068-4.697-4.068-11.669,0-16.367c0.993-1.146,24.756-28.387,63.259-55.881c51.505-36.777,105.003-56.219,154.71-56.219 c49.708,0,103.207,19.441,154.71,56.219c38.502,27.494,62.266,54.734,63.259,55.881c4.068,4.697,4.068,11.669,0,16.367 c-0.993,1.146-24.756,28.387-63.259,55.881C324.227,321.863,270.729,341.304,221.02,341.304z M29.638,221.021 c9.61,9.799,27.747,27.03,51.694,44.071c32.83,23.361,83.714,51.212,139.688,51.212s106.859-27.851,139.688-51.212 c23.944-17.038,42.082-34.271,51.694-44.071c-9.609-9.799-27.747-27.03-51.694-44.071 c-32.829-23.362-83.714-51.212-139.688-51.212s-106.858,27.85-139.688,51.212C57.388,193.988,39.25,211.219,29.638,221.021z"></path>
                </g>
                <g>
                  <path d="M221.02,298.521c-42.734,0-77.5-34.767-77.5-77.5c0-42.733,34.766-77.5,77.5-77.5c18.794,0,36.924,6.814,51.048,19.188 c5.193,4.549,5.715,12.446,1.166,17.639c-4.549,5.193-12.447,5.714-17.639,1.166c-9.564-8.379-21.844-12.993-34.576-12.993 c-28.949,0-52.5,23.552-52.5,52.5s23.551,52.5,52.5,52.5c28.95,0,52.5-23.552,52.5-52.5c0-6.903,5.597-12.5,12.5-12.5 s12.5,5.597,12.5,12.5C298.521,263.754,263.754,298.521,221.02,298.521z"></path>
                </g>
                <g>
                  <path d="M221.02,246.021c-13.785,0-25-11.215-25-25s11.215-25,25-25c13.786,0,25,11.215,25,25S234.806,246.021,221.02,246.021z"></path>
                </g>
              </g>
            </g>
          </svg>
        </button>
  </div>s*/}
      <div className={`block lg:w-[50%] md:w-[50%] w-full space-y-3`}>
        <div
          ref={imageRef}
          style={{
            backgroundImage: `linear-gradient(to bottom left, ${cardColor}, ${reduceIntensity(
              cardColor || "",
              50
            )})`,
          }}
          className={`flex mx-auto items-center justify-center 2xl:h-[400px] 2xl:w-[400px] xl:h-[400px] xl:w-[400px] lg:h-[400px] lg:w-[400px] md:h-[400px] h-[300px] w-[300px] rounded-[10px] ${
            !cardColor && "border"
          }`}
        >
          <p
            className={`font-[700] ${font} text-white text-[50px] w-[150px] text-center`}
          >
            {inputs.title}
          </p>
        </div>
        <ToggleGroup
          type="single"
          variant={"default"}
          className={`space-x-[10px] focus:!ring-0`}
          onValueChange={(e) => {
            setCardColor(e);
          }}
        >
          <ToggleGroupItem
            value="#00ff00"
            className={`data-[state=on]:bg-neutral-300 rounded-full w-[35px] h-[35px] !p-[5px] focus:!ring-0`}
          >
            <div className={`w-full h-full rounded-full bg-[#00ff00]`}></div>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="#FFA500"
            className={`data-[state=on]:bg-neutral-300 w-[35px] h-[35px] rounded-full !p-[5px] focus:!ring-0`}
          >
            <div className={`w-full h-full rounded-full bg-[#FFA500]`}></div>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="#800080"
            className={`data-[state=on]:bg-neutral-300 w-[35px] h-[35px] rounded-full !p-[5px]`}
          >
            <div className={`w-full h-full rounded-full bg-[#800080]`}></div>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="#0000ff"
            className={`data-[state=on]:bg-neutral-300 w-[35px] h-[35px] rounded-full !p-[5px]`}
          >
            <div className={`w-full h-full rounded-full bg-[#0000ff]`}></div>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="#FF0000"
            className={`data-[state=on]:bg-neutral-300 w-[35px] h-[35px] rounded-full !p-[5px]`}
          >
            <div className={`w-full h-full rounded-full bg-[#FF0000]`}></div>
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          variant={"outline"}
          onValueChange={(e) => {
            setFont(e);
          }}
          defaultValue={_Rowdies.className}
        >
          <ToggleGroupItem
            className={_Rowdies.className}
            value={`${_Rowdies.className}`}
          >
            Hello world
          </ToggleGroupItem>
          <ToggleGroupItem
            className={`${_Rubik_Bubbles.className} font-[400]`}
            value={`${_Rubik_Bubbles.className}`}
          >
            Hello world
          </ToggleGroupItem>
          <ToggleGroupItem
            className={`${_Bebas_Neue.className} font-[400]`}
            value={`${_Bebas_Neue.className}`}
          >
            Hello world
          </ToggleGroupItem>
          <ToggleGroupItem
            className={`${_Oi.className} font-[400]`}
            value={`${_Oi.className}`}
          >
            Hello world
          </ToggleGroupItem>
          <ToggleGroupItem
            className={`${_Luckiest_Guy.className} font-[400]`}
            value={`${_Luckiest_Guy.className}`}
          >
            Hello world
          </ToggleGroupItem>
          <ToggleGroupItem
            className={`${_Comic_sans.className} font-[400]`}
            value={`${_Comic_sans.className}`}
          >
            Hello world
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="lg:w-[40%] md:w-[40%] w-full block mx-auto py-[20px] px-5 space-y-[30px]">
        <div className="text-violet11 text-[23px] font-[600] leading-[18px]">
          Create
        </div>
        {/* <Field label="Collection">
          <Select>
            <SelectTrigger className="w-full h-[50px]">
              <SelectValue placeholder={`collection`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </Field> */}
        <Field label="Title">
          <Input
            type="text"
            className={`h-[50px] focus:!ring-0`}
            name="title"
            maxLength={25}
            value={title}
            onChange={handleChange}
          />
        </Field>
        <div className={`w-full flex relative `}>
          <Field label="Price">
            <Input
              placeholder="0"
              type="number"
              pattern="[0-9]"
              name="price"
              value={price}
              onKeyDown={handleKeyDown}
              className={`h-[50px] w-full focus:!ring-0`}
              onChange={handleChange}
            />
          </Field>

          <Select disabled>
            <SelectTrigger className="w-[60px] absolute top-[25px] right-[7px] h-[40px]">
              <SelectValue placeholder={`ETH`} />
            </SelectTrigger>
          </Select>
        </div>

        <div className={`block toggle-content w-full px-1 py-3 space-y-4`}>
          {/* <Field label="Mint duration">
            <Select>
              <SelectTrigger className="w-full h-[50px]">
                <SelectValue placeholder={`4 Hours`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 hour">1 Hour</SelectItem>
                <SelectItem value="4 hours">4 Hours</SelectItem>
                <SelectItem value="24 hours">24 Hours</SelectItem>
                <SelectItem value="3 days">3 Days</SelectItem>
                <SelectItem value="1 week">1 Week</SelectItem>
                <SelectItem value="1 month">1 Month</SelectItem>
                <SelectItem value="3 months">3 Months</SelectItem>
                <SelectItem value="6 months">6 Months</SelectItem>
                <SelectItem value="open">Open</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className={`block py-4 px-5 bg-neutral-100 h-[70px] rounded-lg`}>
            <fieldset className={`flex space-x-3 items-center`}>
              <Checkbox id="first" className={``} disabled />
              <label
                htmlFor="first"
                className={`text-neutral-600 font-semibold`}
              >
                Mint first edition
              </label>
            </fieldset>
          </div> */}
          <Tabs defaultValue="me" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-[80px]">
              <TabsTrigger value="me" className={`h-[70px]`}>
                Me
              </TabsTrigger>
              <TabsTrigger disabled value="split" className={`h-[70px]`}>
                Split
              </TabsTrigger>
              <TabsTrigger disabled value="else" className={`h-[70px] `}>
                Someone else
              </TabsTrigger>
            </TabsList>

            <TabsContent value="split">
              <Card>
                <CardContent className="space-y-3 !px-0 py-4">
                  <div className="space-y-1 px-4">
                    <Input
                      id="address"
                      type="text"
                      className={`placeholder:text-neutral-400 h-[50px]`}
                      placeholder={`Enter address or ENS...`}
                    />
                  </div>
                  <div
                    className={`w-full flex justify-between items-center px-4`}
                  >
                    <div
                      className={`w-[30px] h-[30px] bg-orange-600 rounded-full`}
                    ></div>
                    <p className={`text-neutral-600`}>
                      {address?.slice(0, 6)}...{address?.slice(-5)}
                      <span className={`text-neutral-400`}>(you)</span>
                    </p>
                    <div
                      className={`flex items-center w-[130px] h-[50px] justify-around`}
                    >
                      <div
                        className={`percentage-container relative w-[100px] h-[50px]`}
                      >
                        <Input
                          type="number"
                          name="sharePercentage"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          className={`w-[100px] text-neutral-600 h-[50px]`}
                          value={sharePercentage}
                        />
                        <p
                          className={`absolute top-[50%] text-neutral-600 transform translate-y-[-50%] right-3 percentage-sign`}
                        >
                          %
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`text-[19px] font-sans text-neutral-400 font-thin`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <Separator className={`w-full`} />
                  <div
                    className={`flex px-4 items-center justify-between w-full`}
                  >
                    <p>Total</p>
                    <div className={`flex items-center`}>
                      <p>{sharePercentage}%</p>
                      <svg
                        id="progress"
                        width="33"
                        height="33"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          pathLength="1"
                          className="bg"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="30"
                          className="indicator"
                          fill={`none`}
                          stroke="#000000" // Customize the color as needed
                          strokeWidth="10"
                          initial={{ strokeDashoffset: circleCircumference }}
                          animate={{
                            strokeDashoffset:
                              circleCircumference *
                              (1 - inputs.sharePercentage / 100),
                          }}
                          transition={{ duration: 0.5 }}
                          style={{
                            strokeDasharray: circleCircumference,
                            rotate: -90,
                            transformOrigin: "50% 50%",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="else">
              <Card>
                <CardContent className="space-y-2">
                  <div className="space-y-1 pt-3">
                    <Input
                      id="someoneElse"
                      onChange={handleChange}
                      name="someoneElse"
                      value={someoneElse}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* <div>
            <p className={`font-bold`}>Mint Start</p>
            <Tabs className={`w-full`} defaultValue="now">
              <TabsList className="grid w-full grid-cols-2 h-[60px]">
                <TabsTrigger
                  value="now"
                  className={`h-[50px] font-semibold rounded-lg`}
                >
                  Now
                </TabsTrigger>
                <TabsTrigger
                  value="future"
                  className={`h-[50px] font-semibold rounded-lg`}
                >
                  Future
                </TabsTrigger>
              </TabsList>
              <TabsContent value="future">
                <div
                  className={`flex w-full items-center space-x-3 justify-center py-2`}
                >
                  <DateTimePicker
                    className={`!w-[80%] !h-[50px] !rounded-[12px] !border-neutral-500`}
                    onChange={onChange}
                    format="dd-MM-y hh-mm a"
                    value={dateValue}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onChange(new Date());
                    }}
                    className={`text-neutral-600 font-semibold`}
                  >
                    Reset
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div> */}
          <Field label="Edition size">
            <Input
              className={`h-[50px]`}
              type="number"
              name="quantity"
              value={quantity}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Field>
          {/* <div>
            <p className={`font-bold`}>Mint limit per wallet</p>
            <Tabs defaultValue="unlimited">
              <TabsList className="grid w-full grid-cols-2 h-[60px]">
                <TabsTrigger
                  value="unlimited"
                  className={`h-[50px] font-semibold rounded-lg`}
                >
                  Unlimited
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className={`h-[50px] font-semibold rounded-lg`}
                >
                  Custom
                </TabsTrigger>
              </TabsList>
              <TabsContent value="custom">
                <div
                  className={`flex w-full items-center space-x-3 justify-center py-2`}
                >
                  <Input className={`w-[90%] h-[50px]`} defaultValue={1000} />
                </div>
              </TabsContent>
            </Tabs>
          </div> */}
        </div>
        <button
          disabled={isValid()}
          onClick={handleSubmit}
          type="button"
          className={`w-[200px] ${
            isValid() && "disabled:opacity-[0.4]"
          } h-[40px] font-bold flex mx-auto items-center justify-center text-center rounded-[20px] text-white bg-black`}
        >
          Create
        </button>
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={loading}
          currentState={txState}
        />
      </div>
    </form>
  );
}

export default CreateCollection;
