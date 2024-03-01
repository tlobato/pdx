import { CloudinaryFile } from "@/app/types";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";

cloudinary.config({
  cloud_name: "darjfiyou",
  api_key: "582881756283974",
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("pdf") as File;
  if (file.type !== "application/pdf") return;
  const arrayBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
  const uploadedFile = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        allowed_formats: ["pdf"],
        tags: ["uploaded-pdfs"],
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });

  const { secure_url, pages, public_id } = uploadedFile as CloudinaryFile;

  try {
    //blobize the file (for pinecone vector db)
    const res = await fetch(secure_url);
    const blob = await res.blob();

    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();
    const pagesAmount = pageLevelDocs.length;

    //vectorize and index the file
    const pineconeIndex = pinecone.Index("pdx");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: public_id,
    });
  } catch (err) {
    throw new Error("there was an error in the file upload");
  }

  return new NextResponse(
    JSON.stringify({ name: file.name, secure_url, pages, public_id }),
    { status: 200 }
  );
}
