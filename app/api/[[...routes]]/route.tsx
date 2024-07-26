/** @jsxImportSource frog/jsx */
/* eslint-disable react/jsx-key */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { abi } from "@/ABIs/ProxyContract";
import { readContracts } from "@wagmi/core";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { config } from "@/config/wagmi.server.config";
import { sepolia } from "viem/chains";
import { Address } from "viem";

const app = new Frog({
  title: "Impact Frog Frames v2",
  assetsPath: "/",
  basePath: "/api",
});
// test id = 0xFc793BCee784514Fa64b42896bcF967DCA9b29C5

const frontendURL = process.env.NEXT_PUBLIC_FRONTEND as string;

let contractAdress: string;
let unitPrice: bigint | undefined;
app.frame("/frame", async (c) => {
  const { status } = c;
  const query = c.req.query();
  contractAdress = query.id;
  const NFTContract = {
    address: contractAdress as Address,
    abi: abi,
    chainId: sepolia.id,
  } as const;
  const result = await readContracts(config, {
    contracts: [
      {
        ...NFTContract,
        functionName: "tokenURI",
        args: [BigInt(0)],
      },
      {
        ...NFTContract,
        functionName: "_unitPrice",
      },
    ],
    multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
  });

  const tokenURI = result[0].result;
  if (!tokenURI) {
    throw Error("tokenURI is undefined");
  }
  const data = await (await fetch(tokenURI)).json();
  unitPrice = result[1].result;
  console.log(data);
  return c.res({
    browserLocation: `${frontendURL}/dashboard/collection/mint/${contractAdress}`,
    image: data.image,
    intents: [
      <TextInput placeholder="Enter quantity..." />,
      <Button.Transaction target="/buy">Buy</Button.Transaction>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.transaction("/buy", (c) => {
  const { inputText } = c;
  console.log(inputText);
  if (!unitPrice) {
    throw Error("unitPrice is undefined");
  }
  return c.contract({
    abi: abi,
    chainId: "eip155:11155111",
    value: BigInt(BigInt(inputText || 1) * unitPrice),
    functionName: "mintBatch",
    to: contractAdress as Address,
    args: [BigInt(inputText || 1)],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
