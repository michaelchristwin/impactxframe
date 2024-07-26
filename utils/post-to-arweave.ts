"use server";

import Irys from "@irys/sdk";
import Arweave from "arweave";

//const baseUrl = "https://ar-io.net";
interface handleArgs {
  title: string;
  description: string;
  image: string;
}
export default async function handle(args: handleArgs) {
  try {
    const arweave = Arweave.init({
      host: "arweave.net",
      protocol: "https",
      port: 443,
    });

    const irys = new Irys({
      key: await arweave.wallets.generate(),
      url: "https://node2.irys.xyz",
      token: "arweave",
    });

    const { title, description, image } = args;
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");
    console.log("image size:", imgBuffer.byteLength);
    const imageTags = [
      { name: "application-id", value: "Impact-NFT" },
      { name: "Content-Type", value: "image/png" },
    ];
    const imageReceipt = await irys.upload(imgBuffer, { tags: imageTags });
    const imageReceiptId = imageReceipt.id;
    const metadataTags = [
      { name: "application-id", value: "Impact-Collection" },
      { name: "Content-Type", value: "application/json" },
    ];
    const nftMetadata = {
      title: title,
      description: description,
      image: `https://ar-io.net/${imageReceiptId}`,
    };

    const metadata = JSON.stringify(nftMetadata);
    //console.log("data size:", Buffer.byteLength(metadata, "utf8"));
    const receipt = await irys.upload(metadata, { tags: metadataTags });
    const data = { metadata: receipt.id };
    return { data: `https://ar-io.net/${data.metadata}`, status: "success" };
  } catch (err) {
    console.error(err);
    return { data: "", status: "fail" };
  }
}
